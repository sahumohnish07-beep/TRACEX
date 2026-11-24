import React, { useEffect, useRef } from 'react';
import cytoscape, { type Core, type EventObject } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import type { CytoscapeElement, GraphNodeData, GraphEdgeData } from './graphTypes';
import { graphStyles } from './graphStyles';

// Register fcose layout with cytoscape safely
try {
  cytoscape.use(fcose);
} catch {
  // Already registered
}

interface CytoscapeGraphProps {
  elements: CytoscapeElement[];
  onNodeSelect?: (node: GraphNodeData) => void;
  onEdgeSelect?: (edge: GraphEdgeData) => void;
  onBackgroundClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  cyInstanceRef?: React.MutableRefObject<Core | null>;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  elements,
  onNodeSelect,
  onEdgeSelect,
  onBackgroundClick,
  className,
  style,
  cyInstanceRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalCyRef = useRef<Core | null>(null);

  // Keep callback refs fresh without causing re-initialization
  const onNodeSelectRef = useRef(onNodeSelect);
  onNodeSelectRef.current = onNodeSelect;
  const onEdgeSelectRef = useRef(onEdgeSelect);
  onEdgeSelectRef.current = onEdgeSelect;
  const onBackgroundClickRef = useRef(onBackgroundClick);
  onBackgroundClickRef.current = onBackgroundClick;

  // Initialize Cytoscape once on container mount
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: graphStyles,
      boxSelectionEnabled: false,
      autounselectify: false,
      userPanningEnabled: true,
      userZoomingEnabled: true,
      minZoom: 0.2,
      maxZoom: 3.5,
      wheelSensitivity: 0.2,
    });

    internalCyRef.current = cy;
    if (cyInstanceRef) {
      cyInstanceRef.current = cy;
    }

    // Node selection
    cy.on('tap', 'node', (e: EventObject) => {
      const node = e.target;
      const nodeData = node.data() as GraphNodeData;
      cy.elements().removeClass('selected');
      node.addClass('selected');
      if (onNodeSelectRef.current) {
        onNodeSelectRef.current(nodeData);
      }
    });

    // Edge selection
    cy.on('tap', 'edge', (e: EventObject) => {
      const edge = e.target;
      const edgeData = edge.data() as GraphEdgeData;
      cy.elements().removeClass('selected');
      edge.addClass('selected');
      if (onEdgeSelectRef.current) {
        onEdgeSelectRef.current(edgeData);
      }
    });

    // Background tap
    cy.on('tap', (e: EventObject) => {
      if (e.target === cy) {
        cy.elements().removeClass('highlighted dimmed selected');
        if (onBackgroundClickRef.current) {
          onBackgroundClickRef.current();
        }
      }
    });

    // Hover effects (neighbors highlighted, others dimmed)
    cy.on('mouseover', 'node', (e: EventObject) => {
      const sel = e.target;
      const neighborhood = sel.closedNeighborhood();
      cy.elements().addClass('dimmed');
      neighborhood.removeClass('dimmed').addClass('highlighted');
    });

    cy.on('mouseout', 'node', () => {
      cy.elements().removeClass('highlighted dimmed');
    });

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (internalCyRef.current) {
        internalCyRef.current.resize();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (internalCyRef.current) {
        internalCyRef.current.destroy();
        internalCyRef.current = null;
      }
      if (cyInstanceRef) {
        cyInstanceRef.current = null;
      }
    };
  }, [cyInstanceRef]);

  const lastLoadedElementIdsRef = useRef<string>('');

  // Update elements and run layout ONLY when elements dataset actually changes
  useEffect(() => {
    const cy = internalCyRef.current;
    if (!cy) return;

    // Check if element IDs or length actually changed
    const currentIds = elements.map(el => el.data.id).sort().join(',');
    if (lastLoadedElementIdsRef.current === currentIds && cy.elements().length === elements.length) {
      // Elements are unchanged; do NOT re-run layout or modify graph hierarchy
      return;
    }

    lastLoadedElementIdsRef.current = currentIds;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    // Apply fcose layout only when elements collection actually changes
    const layout = cy.layout({
      name: 'fcose',
      // @ts-expect-error fcose specific options
      quality: 'default',
      randomize: true,
      animate: false,
      nodeDimensionsIncludeLabels: true,
      uniformNodeDimensions: false,
      fit: true,
      padding: 35,
      nodeRepulsion: () => 4800,
      idealEdgeLength: () => 110,
      edgeElasticity: () => 0.45,
    });
    layout.run();
  }, [elements]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        ...style,
      }}
      role="region"
      aria-label="Interactive criminal network graph visualization"
    />
  );
};
