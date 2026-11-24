import React, { useEffect, useRef } from 'react';
import cytoscape, { type Core } from 'cytoscape';

interface NetworkBackgroundProps {
  mousePos: { x: number; y: number };
}

interface DriftNode {
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
  const nodesRef = useRef<DriftNode[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeCount = 36; // 30-40 slowly drifting nodes

    const nodes: DriftNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `ln-${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() > 0.6 ? 5 : 4,
      });
    }
    nodesRef.current = nodes;

    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      elements: nodes.map(n => ({
        group: 'nodes',
        data: { id: n.id, size: n.size },
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
      ],
      layout: {
        name: 'preset',
      },
    });

    cyRef.current = cy;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connectDistance = 160;
    const activeDistance = 135;

    const updateFrame = () => {
      if (!cyRef.current) return;
      const cyInstance = cyRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const currentNodes = nodesRef.current;
      const mx = mousePos.x;
      const my = mousePos.y;

      if (!prefersReducedMotion) {
        for (let i = 0; i < currentNodes.length; i++) {
          const n = currentNodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x <= 15) { n.x = 15; n.vx = Math.abs(n.vx); }
          else if (n.x >= w - 15) { n.x = w - 15; n.vx = -Math.abs(n.vx); }

          if (n.y <= 15) { n.y = 15; n.vy = Math.abs(n.vy); }
          else if (n.y >= h - 15) { n.y = h - 15; n.vy = -Math.abs(n.vy); }
        }
      }

      cyInstance.batch(() => {
        // Update node positions
        for (let i = 0; i < currentNodes.length; i++) {
          const n = currentNodes[i];
          const cyNode = cyInstance.getElementById(n.id);
          cyNode.position({ x: n.x, y: n.y });
        }

        // Compute edges dynamically
        const activePairs: Array<{ source: string; target: string; isActive: boolean }> = [];
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const na = currentNodes[i];
            const nb = currentNodes[j];
            const dist = Math.hypot(na.x - nb.x, na.y - nb.y);

            if (dist < connectDistance) {
              const midX = (na.x + nb.x) / 2;
              const midY = (na.y + nb.y) / 2;
              const distMidToMouse = Math.hypot(midX - mx, midY - my);
              const isActive = distMidToMouse < activeDistance && mx > 0 && my > 0;

              activePairs.push({
                source: na.id,
                target: nb.id,
                isActive,
              });
            }
          }
        }

        const existingEdges = cyInstance.edges();
        const targetMap = new Set<string>();

        activePairs.forEach(pair => {
          const edgeId = `e-${pair.source}-${pair.target}`;
          targetMap.add(edgeId);

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

        existingEdges.forEach(e => {
          if (!targetMap.has(e.id())) {
            cyInstance.remove(e);
          }
        });
      });

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    if (!prefersReducedMotion) {
      animFrameRef.current = requestAnimationFrame(updateFrame);
    } else {
      updateFrame();
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
  }, [mousePos.x, mousePos.y]);

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
