import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Core } from 'cytoscape';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  EyeOff,
  Maximize2,
  AlertTriangle,
  GitCompare,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { CytoscapeGraph } from '../../graph/CytoscapeGraph';
import { useGraphControls } from '../../graph/useGraphControls';
import type { GraphNodeData, CytoscapeElement } from '../../graph/graphTypes';
import { fetchCaseGraph } from '../../api/services';
import { MOCK_INVESTIGATION_VIEWS } from '../../data/mockData';

export const InvestigationViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cyRef = useRef<Core | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [elements, setElements] = useState<CytoscapeElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentView = MOCK_INVESTIGATION_VIEWS.find(v => v.id === id) || MOCK_INVESTIGATION_VIEWS[0];
  const controls = useGraphControls(cyRef);

  const loadViewGraph = useCallback(async () => {
    const caseId = currentView.caseId || 'CASE-2026-0891';
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCaseGraph(caseId);
      setElements(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load investigation view graph.');
    } finally {
      setLoading(false);
    }
  }, [currentView.caseId]);

  useEffect(() => {
    loadViewGraph();
  }, [loadViewGraph]);

  const handleSave = () => {
    setSaveStatus('Investigation view saved successfully to local station sandbox.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleHideSelected = () => {
    if (selectedNode) {
      controls.hide([selectedNode.id]);
      setSelectedNode(null);
    }
  };

  const handleExpandSelected = () => {
    if (selectedNode) {
      controls.expand(selectedNode.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height) - 100px)' }}>
      <PageHeader
        title={`Investigation Workspace: ${currentView.title}`}
        subtitle={`${currentView.id} · Linked to ${currentView.caseId}`}
        onBack={() => navigate(`/cases/${currentView.caseId}`)}
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              icon={<GitCompare size={16} />}
              onClick={() => navigate(`/cases/${currentView.caseId}/network`)}
            >
              Compare with Original Record
            </Button>
            <Button
              variant="primary"
              icon={<Save size={16} />}
              onClick={handleSave}
            >
              Save View
            </Button>
          </div>
        }
      />

      {/* Prominent Working Copy Banner */}
      <Card
        padding="12px 20px"
        style={{
          marginBottom: '16px',
          backgroundColor: 'var(--status-warning-bg)',
          borderColor: '#FFE0B2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--status-warning)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--status-warning)' }}>
            PRIVATE WORKING COPY:
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text)' }}>
            Changes here do not modify the original record. This is your personal investigation workspace.
          </span>
        </div>

        {saveStatus && (
          <span style={{ fontSize: '14px', color: 'var(--status-success)', fontWeight: 600 }}>
            {saveStatus}
          </span>
        )}
      </Card>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            icon={<EyeOff size={16} />}
            disabled={!selectedNode}
            onClick={handleHideSelected}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Hide Node
          </Button>
          <Button
            variant="secondary"
            icon={<Maximize2 size={16} />}
            disabled={!selectedNode}
            onClick={handleExpandSelected}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Expand Neighbors
          </Button>
          <Button
            variant="secondary"
            disabled={!selectedNode}
            onClick={() => selectedNode && controls.focus(selectedNode.id)}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Focus Node
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            icon={<ZoomIn size={16} />}
            onClick={controls.zoomIn}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Zoom In
          </Button>
          <Button
            variant="secondary"
            icon={<ZoomOut size={16} />}
            onClick={controls.zoomOut}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Zoom Out
          </Button>
          <Button
            variant="secondary"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              setSelectedNode(null);
              controls.reset();
            }}
            style={{ minHeight: '38px', padding: '0 12px' }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Canvas */}
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
        {loading && <LoadingState message="Loading sandbox graph view..." minHeight="400px" />}

        {error && (
          <ErrorState
            title="Sandbox graph unavailable"
            message={error}
            onAction={loadViewGraph}
            minHeight="400px"
          />
        )}

        {!loading && !error && elements.length === 0 && (
          <EmptyState
            title="Empty investigation workspace"
            message="No entities or connections added to this private sandbox view."
            minHeight="400px"
          />
        )}

        {!loading && !error && elements.length > 0 && (
          <CytoscapeGraph
            elements={elements}
            cyInstanceRef={cyRef}
            onNodeSelect={n => setSelectedNode(n)}
            onBackgroundClick={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};
