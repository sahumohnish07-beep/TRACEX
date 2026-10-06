import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Core } from 'cytoscape';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  List,
  GitFork,
  Share2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { SearchInput } from '../../components/SearchInput';
import { SidePanel } from '../../components/SidePanel';
import { SourceBadge } from '../../components/SourceBadge';
import { DataTable, type Column } from '../../components/DataTable';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { CytoscapeGraph } from '../../graph/CytoscapeGraph';
import { useGraphControls } from '../../graph/useGraphControls';
import type { GraphNodeData, GraphEdgeData, CytoscapeElement, PriorityLevel } from '../../graph/graphTypes';
import { fetchCaseDetail, fetchCaseGraph } from '../../api/services';
import type { CaseItem } from '../../types';

export const NetworkAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cyRef = useRef<Core | null>(null);

  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);
  const [elements, setElements] = useState<CytoscapeElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdgeData | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [activeEdgeFilter, setActiveEdgeFilter] = useState<string>('ALL');

  const controls = useGraphControls(cyRef);

  const loadGraph = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [caseData, graphData] = await Promise.all([
        fetchCaseDetail(id),
        fetchCaseGraph(id),
      ]);
      setCurrentCase(caseData);
      const normalizedElements: CytoscapeElement[] = Array.isArray(graphData)
        ? graphData
        : [...((graphData as any)?.nodes || []), ...((graphData as any)?.edges || [])];
      setElements(normalizedElements);
    } catch (err: any) {
      setError(err?.message || 'Failed to load case subgraph from Neo4j.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    controls.search(val);
  };

  const handleNodeSelect = (node: GraphNodeData) => {
    setSelectedEdge(null);
    setSelectedNode(node);
  };

  const handleEdgeSelect = (edge: GraphEdgeData) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Node table columns for accessible List View (memoized to keep reference stable)
  const listNodes = React.useMemo(() => {
    return elements
      .filter(el => el.group === 'nodes')
      .map(el => el.data as GraphNodeData);
  }, [elements]);

  const filteredElements = React.useMemo(() => {
    return elements.filter(el => {
      if (el.group === 'edges' && activeEdgeFilter !== 'ALL') {
        const edge = el.data as any;
        return edge.category === activeEdgeFilter || edge.edgeType === activeEdgeFilter;
      }
      return true;
    });
  }, [elements, activeEdgeFilter]);

  const getPriorityBadge = (priority?: PriorityLevel) => {
    const level = priority || 'MEDIUM';
    const config = {
      CRITICAL: { bg: '#FEF3F2', color: '#B42318', border: '#FDA29B', label: 'CRITICAL PRIORITY' },
      HIGH: { bg: '#FEF6EE', color: '#B54708', border: '#FDB022', label: 'HIGH PRIORITY' },
      MEDIUM: { bg: '#EFF8FF', color: '#175CD3', border: '#84CAFF', label: 'MEDIUM PRIORITY' },
      LOW: { bg: '#F8F9FC', color: '#475467', border: '#D0D5DD', label: 'ROUTINE MONITORING' },
    }[level];

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
        }}
      >
        <AlertTriangle size={12} />
        {config.label}
      </span>
    );
  };

  const listColumns: Column<GraphNodeData>[] = [
    {
      header: 'Identifier',
      accessor: 'id',
      width: '160px',
      render: n => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {n.id}
        </span>
      ),
    },
    {
      header: 'Entity Label',
      accessor: 'label',
      render: n => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{n.label}</span>
          {n.isKingpin && (
            <span
              style={{
                backgroundColor: '#B42318',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              KINGPIN
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'nodeType',
      width: '120px',
    },
    {
      header: 'Priority',
      width: '160px',
      render: n => getPriorityBadge(n.investigativePriority),
    },
    {
      header: 'Classification',
      render: n => n.sublabel || '—',
    },
    {
      header: 'Source Verification',
      width: '200px',
      render: n => <SourceBadge type={n.sourceType} compact />,
    },
    {
      header: 'Connections',
      accessor: 'connectionsCount',
      width: '110px',
      align: 'right',
      render: n => <span>{n.connectionsCount || 0} links</span>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height) - 100px)' }}>
      <PageHeader
        title={`Network Analysis: ${currentCase?.title || id || 'Case Subgraph'}`}
        subtitle={`${currentCase?.id || id || ''} · Multi-entity association graph`}
        onBack={() => navigate(currentCase ? `/cases/${currentCase.id}` : '/cases')}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="secondary"
              icon={<GitFork size={16} />}
              onClick={() => navigate(`/cases/${currentCase?.id || id}/missing-links`)}
            >
              Missing Link Analysis
            </Button>
            <Button
              variant={isListView ? 'primary' : 'secondary'}
              icon={<List size={16} />}
              onClick={() => setIsListView(!isListView)}
              aria-label={isListView ? 'Switch to Graph View' : 'Switch to Accessible List View'}
            >
              {isListView ? 'Graph View' : 'List View'}
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          borderBottom: 'none',
        }}
      >
        <div style={{ width: '320px' }}>
          <SearchInput
            value={searchQuery}
            onValueChange={handleSearchChange}
            placeholder="Search nodes in network..."
            ariaLabel="Search nodes in network"
          />
        </div>

        {/* Filter connections */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="edge-filter-select" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Filter Links:
          </label>
          <select
            id="edge-filter-select"
            value={activeEdgeFilter}
            onChange={e => setActiveEdgeFilter(e.target.value)}
            style={{
              height: '38px',
              minHeight: '38px',
              padding: '0 12px',
              fontSize: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Connection Types</option>
            <option value="COMMUNICATION">Communications (CDR / Voice)</option>
            <option value="FINANCIAL_TRANSFER">Financial Transfers</option>
            <option value="ASSOCIATION">Co-accused / Syndicate</option>
            <option value="OWNERSHIP">Ownership / Tenancy</option>
            <option value="SUSPECT_INVOLVEMENT">Case Involvement</option>
          </select>
        </div>

        {/* Zoom & Fit controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            icon={<ZoomIn size={16} />}
            onClick={controls.zoomIn}
            aria-label="Zoom in graph"
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Zoom In
          </Button>
          <Button
            variant="secondary"
            icon={<ZoomOut size={16} />}
            onClick={controls.zoomOut}
            aria-label="Zoom out graph"
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Zoom Out
          </Button>
          <Button
            variant="secondary"
            icon={<RotateCcw size={16} />}
            onClick={controls.reset}
            aria-label="Reset zoom and center graph"
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Main Canvas / List View */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          border: '1px solid var(--border)',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        {loading && <LoadingState message="Loading case subgraph from Neo4j..." minHeight="500px" />}

        {error && (
          <ErrorState
            title="Graph database unavailable"
            message={error}
            onAction={loadGraph}
            minHeight="500px"
          />
        )}

        {!loading && !error && elements.length === 0 && (
          <EmptyState
            title="No graph connections recorded"
            message="No entities or relationships have been linked to this case yet."
            minHeight="500px"
          />
        )}

        {!loading && !error && elements.length > 0 && (
          isListView ? (
            <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
              <DataTable
                columns={listColumns}
                data={listNodes}
                keyExtractor={n => n.id}
                onRowClick={n => handleNodeSelect(n)}
              />
            </div>
          ) : (
            <>
              <CytoscapeGraph
                elements={filteredElements}
                cyInstanceRef={cyRef}
                onNodeSelect={handleNodeSelect}
                onEdgeSelect={handleEdgeSelect}
                onBackgroundClick={handleBackgroundClick}
              />

              {/* Visual Legend (bottom left) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-subtle)',
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  pointerEvents: 'none',
                }}
                aria-label="Graph visual legend"
              >
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Graph Legend</span>
                  <span style={{ fontSize: '11px', color: '#B42318', backgroundColor: '#FEE4E2', padding: '1px 6px', borderRadius: '3px' }}>
                    👑 Kingpin Identified
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #B42318', backgroundColor: '#FFF5F5', display: 'inline-block' }} />
                    Kingpin Target
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'inline-block' }} />
                    Person (Circle)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', border: '2px solid #4A5A9E', display: 'inline-block' }} />
                    Phone (Rectangle)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '8px', borderRadius: '2px', border: '2px solid var(--accent)', display: 'inline-block' }} />
                    Vehicle (Rounded)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', border: '2px solid var(--primary)', transform: 'rotate(45deg)', display: 'inline-block' }} />
                    Location (Diamond)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', border: '2px solid #B42318', display: 'inline-block' }} />
                    Crime Scene
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '6px', display: 'flex', gap: '14px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Solid: Verified</span>
                  <span style={{ color: '#2F5FD0' }}>Dashed: Communication</span>
                  <span style={{ color: '#1E7B4F' }}>Dotted: Financial</span>
                </div>
              </div>
            </>
          )
        )}

        {/* Selected Entity / Node SidePanel */}
        <SidePanel
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          title={selectedNode?.label || 'Entity Details'}
          subtitle={`${selectedNode?.nodeType} · ID: ${selectedNode?.id}`}
        >
          {selectedNode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              {/* Kingpin Banner if applicable */}
              {selectedNode.isKingpin && (
                <div
                  style={{
                    backgroundColor: '#FEF3F2',
                    border: '1px solid #FDA29B',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <ShieldAlert size={24} color="#B42318" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#B42318' }}>
                      PRIMARY SYNDICATE KINGPIN
                    </div>
                    <div style={{ fontSize: '12px', color: '#7A271A' }}>
                      Designated central mastermind under active multi-agency warrants.
                    </div>
                  </div>
                </div>
              )}

              {/* Priority and Source header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>{getPriorityBadge(selectedNode.investigativePriority)}</div>
                <SourceBadge type={selectedNode.sourceType} />
              </div>

              {/* Detailed Priority & Investigation Rationale Section */}
              <div
                style={{
                  backgroundColor: selectedNode.investigativePriority === 'CRITICAL' ? '#FFF5F5' : '#F8F9FC',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${selectedNode.investigativePriority === 'CRITICAL' ? '#FECDCA' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color={selectedNode.investigativePriority === 'CRITICAL' ? '#B42318' : 'var(--primary)'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Why It Should Be Investigated
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--text)', fontWeight: 500 }}>
                  {selectedNode.investigationRationale ||
                    'Key entity linked to syndicate network structure requiring verification of transactions and operational associations.'}
                </p>
              </div>

              {selectedNode.sublabel && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Role / Sublabel:
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                    {selectedNode.sublabel}
                  </span>
                </div>
              )}

              {/* Inspectable Evidence Basis */}
              <div
                style={{
                  backgroundColor: 'var(--bg-page)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Share2 size={15} color="var(--primary)" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    Evidence Basis &amp; Seizure Record:
                  </span>
                </div>
                {selectedNode.evidenceBasis && selectedNode.evidenceBasis.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.45 }}>
                    {selectedNode.evidenceBasis.map((ev, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{ev}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    Directly linked via verified case investigation records and seizure documents.
                  </p>
                )}
              </div>

              {selectedNode.properties && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Entity Attributes
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    {Object.entries(selectedNode.properties).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedNode.nodeType === 'PERSON' && (
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/persons/${selectedNode.id}`)}
                    style={{ width: '100%' }}
                  >
                    View Full Criminal Dossier
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => controls.focus(selectedNode.id)}
                  style={{ width: '100%' }}
                >
                  Focus &amp; Center Node
                </Button>
              </div>
            </div>
          )}
        </SidePanel>

        {/* Selected Relationship / Edge SidePanel */}
        <SidePanel
          isOpen={!!selectedEdge}
          onClose={() => setSelectedEdge(null)}
          title={selectedEdge?.label ? `Link: ${selectedEdge.label}` : 'Connection Details'}
          subtitle={`Type: ${selectedEdge?.edgeType || 'Relationship'} · ID: ${selectedEdge?.id}`}
        >
          {selectedEdge && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              {/* Priority and Source header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>{getPriorityBadge(selectedEdge.investigativePriority)}</div>
                <SourceBadge type={selectedEdge.sourceType} />
              </div>

              {/* Edge Endpoints representation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedEdge.source}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{selectedEdge.label}</span>
                  <ArrowRight size={14} />
                </div>
                <div style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedEdge.target}
                </div>
              </div>

              {/* Why This Edge Should Be Investigated According To Priority */}
              <div
                style={{
                  backgroundColor: selectedEdge.investigativePriority === 'CRITICAL' ? '#FFF5F5' : '#F8F9FC',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${selectedEdge.investigativePriority === 'CRITICAL' ? '#FECDCA' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color={selectedEdge.investigativePriority === 'CRITICAL' ? '#B42318' : 'var(--primary)'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Why This Link Must Be Investigated
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--text)', fontWeight: 500 }}>
                  {selectedEdge.investigationRationale ||
                    'Investigative priority requires verification of this communication or transaction link to establish conspiratorial intent.'}
                </p>
              </div>

              {/* Connection Attributes */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Link Properties
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Relationship Type:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{selectedEdge.edgeType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Connection Strength:</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: selectedEdge.strength === 'STRONG' ? '#1E7B4F' : selectedEdge.strength === 'MODERATE' ? '#B54708' : '#5A6475',
                      }}
                    >
                      {selectedEdge.strength || 'STRONG'}
                    </span>
                  </div>
                  {selectedEdge.evidenceCount !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Documented Corroborations:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{selectedEdge.evidenceCount} items</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Corroborating Evidence */}
              <div
                style={{
                  backgroundColor: 'var(--bg-page)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CheckCircle2 size={15} color="#1E7B4F" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    Corroborating Evidence &amp; Logs:
                  </span>
                </div>
                {selectedEdge.evidence && selectedEdge.evidence.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.45 }}>
                    {selectedEdge.evidence.map((ev, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{ev}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    Documented via official case seizure logs and court filings.
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button
                  variant="secondary"
                  icon={<Info size={16} />}
                  onClick={() => {
                    const srcNode = listNodes.find(n => n.id === selectedEdge.source);
                    if (srcNode) handleNodeSelect(srcNode);
                  }}
                  style={{ width: '100%' }}
                >
                  Inspect Source Entity ({selectedEdge.source})
                </Button>
                <Button
                  variant="secondary"
                  icon={<Info size={16} />}
                  onClick={() => {
                    const tgtNode = listNodes.find(n => n.id === selectedEdge.target);
                    if (tgtNode) handleNodeSelect(tgtNode);
                  }}
                  style={{ width: '100%' }}
                >
                  Inspect Target Entity ({selectedEdge.target})
                </Button>
              </div>
            </div>
          )}
        </SidePanel>
      </div>
    </div>
  );
};
