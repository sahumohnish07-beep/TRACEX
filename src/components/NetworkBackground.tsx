import React, { useEffect, useRef } from 'react';
import cytoscape, { type Core } from 'cytoscape';

interface NetworkBackgroundProps {
  mousePos: { x: number; y: number };
}

interface NodePhysics {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ mousePos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const nodesRef = useRef<NodePhysics[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeCount = 36; // Within 30-40 range

    // Initialize node positions & velocities
    const nodes: NodePhysics[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `n${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() > 0.7 ? 5 : 4,
      });
    }
    nodesRef.current = nodes;

    // Create Cytoscape instance
    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      elements: nodes.map(n => ({
        group: 'nodes',
        data: { id: n.id },
        position: { x: n.x, y: n.y },
      })),
      style: [
        {
          selector: 'node',
          style: {
            'width': 'data(size)',
            'height': 'data(size)',
            'background-color': '#4A5A9E',
            'border-width': 0,
            'opacity': 0.85,
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': 'rgba(31, 42, 107, 0.10)',
            'curve-style': 'straight',
            'opacity': 1,
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'edge.active',
          style: {
            'line-color': 'rgba(31, 42, 107, 0.28)',
            'width': 1.25,
          },
        },
        {
          selector: 'node.active',
          style: {
            'background-color': '#2F5FD0',
            'opacity': 1,
          },
        },
      ],
      layout: {
        name: 'preset',
      },
    });

    // Set initial node sizes
    nodes.forEach(n => {
      const cyNode = cy.getElementById(n.id);
      cyNode.data('size', n.size);
    });

    cyRef.current = cy;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Connect nearest nodes initially
    const connectDistance = 165;
    const activeDistance = 140;

    const updateNetwork = () => {
      if (!cyRef.current) return;
      const cyInstance = cyRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const currentNodes = nodesRef.current;
      const mx = mousePos.x;
      const my = mousePos.y;

      if (!prefersReducedMotion) {
        // Update physics
        for (let i = 0; i < currentNodes.length; i++) {
          const n = currentNodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x <= 20) { n.x = 20; n.vx = Math.abs(n.vx); }
          else if (n.x >= w - 20) { n.x = w - 20; n.vx = -Math.abs(n.vx); }

          if (n.y <= 20) { n.y = 20; n.vy = Math.abs(n.vy); }
          else if (n.y >= h - 20) { n.y = h - 20; n.vy = -Math.abs(n.vy); }
        }
      }

      cyInstance.batch(() => {
        // Update node positions
        for (let i = 0; i < currentNodes.length; i++) {
          const n = currentNodes[i];
          const cyNode = cyInstance.getElementById(n.id);
          cyNode.position({ x: n.x, y: n.y });

          // Mouse proximity to node
          const distToMouse = Math.hypot(n.x - mx, n.y - my);
          if (distToMouse < activeDistance && mx > 0 && my > 0) {
            cyNode.addClass('active');
          } else {
            cyNode.removeClass('active');
          }
        }

        // Compute edges dynamically between nodes
        const activeEdgePairs: Array<{ source: string; target: string; isActive: boolean }> = [];
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const na = currentNodes[i];
            const nb = currentNodes[j];
            const dist = Math.hypot(na.x - nb.x, na.y - nb.y);

            if (dist < connectDistance) {
              // Check proximity to cursor
              // Midpoint distance to cursor
              const midX = (na.x + nb.x) / 2;
              const midY = (na.y + nb.y) / 2;
              const distMidToMouse = Math.hypot(midX - mx, midY - my);
              const isActive = distMidToMouse < activeDistance && mx > 0 && my > 0;

              activeEdgePairs.push({
                source: na.id,
                target: nb.id,
                isActive,
              });
            }
          }
        }

        // Synchronize edges with cytoscape
        const existingEdges = cyInstance.edges();
        const existingMap = new Set<string>();
        existingEdges.forEach(e => {
          existingMap.add(e.id());
        });

        const targetEdgeMap = new Set<string>();

        activeEdgePairs.forEach(pair => {
          const edgeId = `e-${pair.source}-${pair.target}`;
          targetEdgeMap.add(edgeId);

          const existingEdge = cyInstance.getElementById(edgeId);
          if (existingEdge.length === 0) {
            cyInstance.add({
              group: 'edges',
              data: {
                id: edgeId,
                source: pair.source,
                target: pair.target,
              },
              classes: pair.isActive ? 'active' : '',
            });
          } else {
            if (pair.isActive && !existingEdge.hasClass('active')) {
              existingEdge.addClass('active');
            } else if (!pair.isActive && existingEdge.hasClass('active')) {
              existingEdge.removeClass('active');
            }
          }
        });

        // Remove old edges
        existingEdges.forEach(e => {
          if (!targetEdgeMap.has(e.id())) {
            cyInstance.remove(e);
          }
        });
      });

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(updateNetwork);
      }
    };

    if (!prefersReducedMotion) {
      animFrameRef.current = requestAnimationFrame(updateNetwork);
    } else {
      updateNetwork();
    }

    const handleResize = () => {
      if (cyRef.current) {
        cyRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      aria-hidden="true"
    />
  );
};
