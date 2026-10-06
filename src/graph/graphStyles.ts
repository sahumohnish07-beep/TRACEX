// Cytoscape stylesheet definitions for TRACE-X
export const graphStyles: any[] = [
  // Base Node Style
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'color': '#1E2430',
      'font-family': 'Inter, -apple-system, sans-serif',
      'font-size': 12,
      'font-weight': 600,
      'text-valign': 'bottom',
      'text-margin-y': 6,
      'background-color': '#FFFFFF',
      'border-width': 2,
      'border-color': '#1F2A6B',
      'width': 42,
      'height': 42,
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.85,
      'text-background-padding': 2,
      'text-background-shape': 'round-rectangle',
      'transition-property': 'opacity, border-width, border-color, background-color',
      'transition-duration': 150,
    },
  },

  // Kingpin / Primary Target Node
  {
    selector: 'node[?isKingpin]',
    style: {
      'shape': 'ellipse',
      'background-color': '#FFF5F5',
      'border-width': 4,
      'border-color': '#B42318',
      'width': 58,
      'height': 58,
      'font-size': 13,
      'font-weight': 700,
      'color': '#7A271A',
      'underlay-color': '#FEE4E2',
      'underlay-padding': 6,
      'underlay-opacity': 0.8,
      'z-index': 100,
    },
  },

  // Node Shapes by NodeType
  {
    selector: 'node[nodeType = "PERSON"]',
    style: {
      'shape': 'ellipse',
      'background-color': '#FFFFFF',
      'border-color': '#1F2A6B',
    },
  },
  {
    selector: 'node[nodeType = "PHONE"]',
    style: {
      'shape': 'rectangle',
      'background-color': '#F4F6F9',
      'border-color': '#4A5A9E',
    },
  },
  {
    selector: 'node[nodeType = "VEHICLE"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#F7F9FC',
      'border-color': '#2F5FD0',
    },
  },
  {
    selector: 'node[nodeType = "LOCATION"]',
    style: {
      'shape': 'diamond',
      'background-color': '#E8EBF7',
      'border-color': '#1F2A6B',
      'width': 46,
      'height': 46,
    },
  },
  {
    selector: 'node[nodeType = "CASE"]',
    style: {
      'shape': 'hexagon',
      'background-color': '#1F2A6B',
      'border-color': '#17205A',
      'color': '#FFFFFF',
      'text-background-color': '#1F2A6B',
      'text-background-opacity': 0.9,
    },
  },
  {
    selector: 'node[nodeType = "CRIME_SCENE"]',
    style: {
      'shape': 'star',
      'background-color': '#FEF3F2',
      'border-color': '#B42318',
      'width': 48,
      'height': 48,
    },
  },

  // Node Source Types
  {
    selector: 'node[sourceType = "AI_ANALYSIS"]',
    style: {
      'border-style': 'dashed',
      'border-color': '#2F5FD0',
    },
  },

  // Base Edge Style
  {
    selector: 'edge',
    style: {
      'width': 1.5,
      'line-color': '#8B97B0',
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
      'label': 'data(label)',
      'font-size': 10,
      'color': '#5A6475',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.85,
      'text-background-padding': 2,
      'text-rotation': 'autorotate',
      'transition-property': 'opacity, width, line-color',
      'transition-duration': 150,
    },
  },

  // Edge Styles by EdgeType
  {
    selector: 'edge[edgeType = "COMMUNICATION"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#2F5FD0',
      'width': 1.75,
    },
  },
  {
    selector: 'edge[edgeType = "FINANCIAL_TRANSFER"]',
    style: {
      'line-style': 'dotted',
      'line-color': '#1E7B4F',
      'width': 2,
    },
  },
  {
    selector: 'edge[sourceType = "AI_ANALYSIS"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#2F5FD0',
      'opacity': 0.85,
    },
  },

  // States: Hover / Neighbor Highlighting
  {
    selector: '.highlighted',
    style: {
      'opacity': 1,
      'border-width': 3,
      'border-color': '#2F5FD0',
      'line-color': '#1F2A6B',
      'width': 2.5,
      'z-index': 999,
    },
  },
  {
    selector: '.dimmed',
    style: {
      'opacity': 0.25,
    },
  },

  // Selected State
  {
    selector: 'node:selected, node.selected',
    style: {
      'border-width': 4,
      'border-color': '#1F2A6B',
      'border-opacity': 1,
      'underlay-color': '#E8EBF7',
      'underlay-padding': 6,
      'underlay-opacity': 0.8,
    },
  },
  {
    selector: 'edge:selected, edge.selected',
    style: {
      'width': 4,
      'line-color': '#B42318',
      'target-arrow-color': '#B42318',
      'underlay-color': '#FEE4E2',
      'underlay-padding': 4,
      'underlay-opacity': 0.9,
      'z-index': 999,
    },
  },
];
