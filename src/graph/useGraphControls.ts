import { useCallback, type RefObject } from 'react';
import type { Core } from 'cytoscape';

export function useGraphControls(cyRef: RefObject<Core | null>) {
  const zoomIn = useCallback(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 1.25,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  }, [cyRef]);

  const zoomOut = useCallback(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.zoom({
      level: cy.zoom() * 0.8,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  }, [cyRef]);

  const reset = useCallback(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      // Unhide all elements that were hidden
      cy.elements().style('display', 'element');
      // Clear all active selection, highlighted, and dimmed states
      cy.elements().removeClass('highlighted dimmed selected');
    });

    // Re-run standard layout to restore default positions cleanly
    const layout = cy.layout({
      name: 'fcose',
      // @ts-expect-error fcose specific options
      quality: 'default',
      randomize: false,
      animate: true,
      animationDuration: 400,
      nodeDimensionsIncludeLabels: true,
      uniformNodeDimensions: false,
      fit: true,
      padding: 35,
      nodeRepulsion: () => 4800,
      idealEdgeLength: () => 110,
      edgeElasticity: () => 0.45,
    });
    layout.run();
  }, [cyRef]);

  const focus = useCallback((nodeId: string) => {
    if (!cyRef.current) return;
    const node = cyRef.current.getElementById(nodeId);
    if (node.length > 0) {
      cyRef.current.animate({
        center: { eles: node },
        zoom: 1.4,
        duration: 300,
      });
      node.select();
    }
  }, [cyRef]);

  const hide = useCallback((ids: string[]) => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    ids.forEach(id => {
      const el = cy.getElementById(id);
      if (el.length > 0) {
        el.style('display', 'none');
      }
    });
  }, [cyRef]);

  const expand = useCallback((nodeId: string) => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      node.connectedEdges().style('display', 'element');
      node.neighborhood().style('display', 'element');
      node.style('display', 'element');
    }
  }, [cyRef]);

  const search = useCallback((query: string) => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    const q = query.trim().toLowerCase();

    cy.elements().removeClass('highlighted dimmed');

    if (!q) {
      return;
    }

    const matches = cy.nodes().filter(node => {
      const label = (node.data('label') || '').toLowerCase();
      const sublabel = (node.data('sublabel') || '').toLowerCase();
      return label.includes(q) || sublabel.includes(q);
    });

    if (matches.length > 0) {
      cy.elements().addClass('dimmed');
      matches.addClass('highlighted');
      matches.connectedEdges().addClass('highlighted');
      matches.neighborhood().addClass('highlighted');

      cy.animate({
        center: { eles: matches },
        zoom: Math.min(1.2, cy.zoom()),
        duration: 250,
      });
    }
  }, [cyRef]);

  return {
    zoomIn,
    zoomOut,
    reset,
    focus,
    hide,
    expand,
    search,
  };
}
