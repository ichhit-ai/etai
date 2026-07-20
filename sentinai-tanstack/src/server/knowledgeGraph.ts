export interface GraphNode {
  id: string;
  label: string;
  type: 'ASSET' | 'PERMIT' | 'SENSOR' | 'HAZARD' | 'RULE';
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  details?: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  active: boolean;
}

export class KnowledgeGraphEngine {
  private nodes: GraphNode[] = [
    // Asset Nodes
    { id: 'asset_z1', label: 'Coke Oven Battery 4', type: 'ASSET', status: 'NORMAL', details: 'Zone 1 Primary Unit', x: 150, y: 80 },
    { id: 'asset_z2', label: 'Gas Recovery Plant', type: 'ASSET', status: 'NORMAL', details: 'Zone 2 By-Product Unit', x: 450, y: 80 },
    
    // Permit Nodes
    { id: 'permit_hot', label: 'PTW-2026-HOT-089', type: 'PERMIT', status: 'WARNING', details: 'Hot Work Welding Permit', x: 150, y: 200 },
    { id: 'permit_conf', label: 'PTW-2026-CONF-042', type: 'PERMIT', status: 'NORMAL', details: 'Confined Space Entry', x: 450, y: 200 },
    
    // Sensor Nodes
    { id: 'sensor_co', label: 'CO Gas Sensor S-01', type: 'SENSOR', status: 'NORMAL', details: 'Gas Telemetry Monitor', x: 50, y: 320 },
    { id: 'sensor_cctv', label: 'CCTV AI Camera C-04', type: 'SENSOR', status: 'NORMAL', details: 'Visual Anomaly Detector', x: 250, y: 320 },
    { id: 'sensor_rfid', label: 'Worker Badge RFID', type: 'SENSOR', status: 'NORMAL', details: 'Personnel Beacon', x: 550, y: 320 },
    
    // Hazard Nodes
    { id: 'hazard_cascade', label: 'SIMOPS Gas Cascade', type: 'HAZARD', status: 'NORMAL', details: 'Multi-Silo Compound Hazard', x: 250, y: 440 },
    
    // Statutory Rule Nodes
    { id: 'rule_oisd', label: 'OISD-STD-105 Cl.4.2', type: 'RULE', status: 'NORMAL', details: 'Hot Work Gas Corridor Rule', x: 100, y: 540 },
    { id: 'rule_dgms', label: 'DGMS Rule 112', type: 'RULE', status: 'NORMAL', details: 'Shift Handoff SIMOPS Ban', x: 400, y: 540 }
  ];

  private edges: GraphEdge[] = [
    { source: 'asset_z1', target: 'permit_hot', relation: 'GOVERNS', active: true },
    { source: 'asset_z2', target: 'permit_conf', relation: 'GOVERNS', active: true },
    { source: 'permit_hot', target: 'sensor_co', relation: 'MONITORED_BY', active: true },
    { source: 'permit_hot', target: 'sensor_cctv', relation: 'MONITORED_BY', active: true },
    { source: 'asset_z2', target: 'sensor_rfid', relation: 'TRACKS', active: true },
    { source: 'sensor_co', target: 'hazard_cascade', relation: 'TRIGGERS', active: false },
    { source: 'sensor_cctv', target: 'hazard_cascade', relation: 'TRIGGERS', active: false },
    { source: 'hazard_cascade', target: 'rule_oisd', relation: 'VIOLATES', active: false },
    { source: 'hazard_cascade', target: 'rule_dgms', relation: 'VIOLATES', active: false }
  ];

  public getGraphState(telemetry: any) {
    const isHighRisk = (telemetry?.risk_analysis?.sentinai_score || 0) > 45;
    const isCritical = (telemetry?.risk_analysis?.sentinai_score || 0) > 75;

    const updatedNodes = this.nodes.map(node => {
      let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';

      if (node.id === 'permit_hot') {
        status = isHighRisk ? 'CRITICAL' : 'WARNING';
      } else if (node.id === 'sensor_co' || node.id === 'sensor_cctv') {
        status = isHighRisk ? 'CRITICAL' : (isHighRisk ? 'WARNING' : 'NORMAL');
      } else if (node.id === 'hazard_cascade') {
        status = isCritical ? 'CRITICAL' : (isHighRisk ? 'WARNING' : 'NORMAL');
      } else if (node.id === 'rule_oisd' || node.id === 'rule_dgms') {
        status = isCritical ? 'CRITICAL' : 'NORMAL';
      }

      return { ...node, status };
    });

    const updatedEdges = this.edges.map(edge => {
      let active = edge.active;
      if (edge.relation === 'TRIGGERS' || edge.relation === 'VIOLATES') {
        active = isHighRisk;
      }
      return { ...edge, active };
    });

    const activeRiskPathways = isHighRisk ? [
      'Coke Oven Battery 4 -> PTW-2026-HOT-089 -> Sensor S-01 -> SIMOPS Gas Cascade -> OISD-STD-105'
    ] : [];

    return {
      nodes: updatedNodes,
      edges: updatedEdges,
      activeRiskPathways,
      nodeCount: updatedNodes.length,
      edgeCount: updatedEdges.length
    };
  }
}

export const knowledgeGraph = new KnowledgeGraphEngine();
