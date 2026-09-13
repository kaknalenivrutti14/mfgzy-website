/* Shop floor -------------------------------------------------------------- */

export const workOrder = {
  id: 'WO-2048',
  product: 'Industrial Gear Assembly',
  operation: 'Machining',
  target: 500,
  startCompleted: 342,
  machine: 'CNC-04',
  operator: 'A. Duarte · Shift B',
  material: 'LOT-2026-0842',
}

export type OperatorStep = { id: string; label: string; hint: string; detail: string }

export const operatorSteps: OperatorStep[] = [
  { id: 'scan-wo', label: 'Scan Work Order', hint: 'WO-2048', detail: 'The operator scans the travel card at the machine.' },
  { id: 'scan-mat', label: 'Scan Material', hint: 'LOT-2026-0842', detail: 'The lot is bound to this order — the wrong lot is rejected.' },
  { id: 'confirm-qty', label: 'Confirm Quantity', hint: '342 units', detail: 'The last confirmed quantity is shown, never re-typed.' },
  { id: 'start', label: 'Start Operation', hint: 'CNC-04', detail: 'Machine time starts; downtime is captured against the asset.' },
  { id: 'record', label: 'Record Production', hint: '+1 unit', detail: 'Every confirmation posts stock, cost and genealogy at once.' },
  { id: 'qc', label: 'Quality Check', hint: 'QC-1028', detail: 'The in-process check belongs to the operation, not a separate errand.' },
  { id: 'complete', label: 'Complete', hint: 'Operation closed', detail: 'The order moves to the next operation in the routing.' },
]

export const completionEffects = [
  'Inventory updated',
  'Traceability updated',
  'Quality record created',
  'Cost updated',
]

/* Quality ----------------------------------------------------------------- */

export type QualityCheck = { name: string; spec: string; result: 'Pass' | 'Fail' }

export type QualityStage = {
  key: string
  name: string
  doc: string
  subject: string
  summary: string
  checks: QualityCheck[]
  score: string
  verdict: 'PASS' | 'NON-CONFORMANCE'
}

export const qualityStages: QualityStage[] = [
  {
    key: 'incoming',
    name: 'Incoming',
    doc: 'QC-1024',
    subject: 'GRN-000847 · Steel Sheet 304',
    summary: 'Material stays in quarantine until the incoming plan passes.',
    checks: [
      { name: 'Mill certificate', spec: 'EN 10204 3.1', result: 'Pass' },
      { name: 'Thickness', spec: '2.00 ± 0.08 mm', result: 'Pass' },
      { name: 'Surface', spec: 'No scoring', result: 'Pass' },
    ],
    score: '100%',
    verdict: 'PASS',
  },
  {
    key: 'in-process',
    name: 'In-Process',
    doc: 'QC-1028',
    subject: 'WO-2048 · Operation 20 Machining',
    summary: 'Checked every 50 units by the operator, at the machine.',
    checks: [
      { name: 'Dimension', spec: 'Tolerance ±0.05 mm', result: 'Pass' },
      { name: 'Surface', spec: 'Ra ≤ 1.6 µm', result: 'Pass' },
      { name: 'Weight', spec: '1.84 ± 0.02 KG', result: 'Pass' },
    ],
    score: '98.8%',
    verdict: 'PASS',
  },
  {
    key: 'final',
    name: 'Final Inspection',
    doc: 'QC-1031',
    subject: 'BATCH-2048 · 250 units',
    summary: 'Two units failed surface finish. They were held, not shipped.',
    checks: [
      { name: 'Dimension', spec: 'Tolerance ±0.05 mm', result: 'Pass' },
      { name: 'Surface finish', spec: 'Ra ≤ 1.6 µm', result: 'Fail' },
      { name: 'Assembly torque', spec: '42 ± 2 Nm', result: 'Pass' },
    ],
    score: '99.2%',
    verdict: 'NON-CONFORMANCE',
  },
]

export const nonConformance = {
  id: 'NCR-0074',
  raisedBy: 'Daniel Okafor · Quality',
  source: 'QC-1031 · BATCH-2048',
  defect: 'Surface finish Ra 2.1 µm against a 1.6 µm limit',
  quantity: '2 units held',
  disposition: 'Rework at Operation 30',
  cost: 'Rework cost posted to WO-2048',
}

/* Production planning ------------------------------------------------------ */

export const planningSteps = [
  { id: 'demand', label: 'Sales Demand', value: '4 orders · 1,820 units' },
  { id: 'mrp', label: 'MRP', value: 'Netting 14 materials' },
  { id: 'availability', label: 'Material Availability', value: '11 covered · 3 short' },
  { id: 'purchase', label: 'Purchase Suggestions', value: '3 requisitions' },
  { id: 'production', label: 'Production Suggestions', value: '6 orders proposed' },
  { id: 'wo', label: 'Work Orders', value: 'WO-2048 … WO-2053' },
  { id: 'schedule', label: 'Machine Schedule', value: '4 machines · 6 days' },
]

export type MachineLoad = { machine: string; value: number; state: 'high' | 'ok' | 'low' }

export const machineUtilisation: MachineLoad[] = [
  { machine: 'CNC-01', value: 92, state: 'high' },
  { machine: 'CNC-02', value: 81, state: 'ok' },
  { machine: 'CNC-03', value: 63, state: 'low' },
  { machine: 'CNC-04', value: 87, state: 'ok' },
  { machine: 'PRESS-01', value: 74, state: 'ok' },
]

export const mrpShortages = [
  { material: 'Steel Sheet 304', required: '5,760 KG', onHand: '1,240 KG', short: '1,800 KG', action: 'Requisition PR-0912' },
  { material: 'Bearing 6204-ZZ', required: '3,640 pcs', onHand: '4,800 pcs', short: 'Covered', action: 'No action' },
  { material: 'Gear Blank 88', required: '1,820 pcs', onHand: '640 pcs', short: '1,180 pcs', action: 'Requisition PR-0913' },
]

/* Procurement -------------------------------------------------------------- */

export const procurementSteps = [
  { id: 'requisition', label: 'Requisition', doc: 'PR-0912', note: 'Raised by MRP for a 1,800 KG shortfall.' },
  { id: 'rfq', label: 'RFQ', doc: 'RFQ-0338', note: 'Sent to three approved suppliers on one line.' },
  { id: 'comparison', label: 'Supplier Comparison', doc: '3 quotes', note: 'Price, lead time and quality rating side by side.' },
  { id: 'approval', label: 'Approval', doc: '$21,780', note: 'Routed by value to the purchase manager.' },
  { id: 'po', label: 'Purchase Order', doc: 'PO-1082', note: 'Issued to Supplier C at the agreed lead time.' },
  { id: 'receipt', label: 'Receipt', doc: 'GRN-000847', note: 'Received against the PO line, lot assigned.' },
  { id: 'invoice', label: 'Invoice', doc: 'BILL-4410', note: 'Three-way matched to the PO and the receipt.' },
]

export type Supplier = {
  name: string
  price: string
  lead: string
  rating: number
  otd: string
  awarded: boolean
}

export const suppliers: Supplier[] = [
  { name: 'Supplier A', price: '$12.40', lead: '7 days', rating: 4.8, otd: '94%', awarded: false },
  { name: 'Supplier B', price: '$11.90', lead: '12 days', rating: 4.4, otd: '88%', awarded: false },
  { name: 'Supplier C', price: '$12.10', lead: '5 days', rating: 4.9, otd: '97%', awarded: true },
]

/* Finance ------------------------------------------------------------------ */

export const financeChain = [
  { id: 'purchase', label: 'Purchase', doc: 'PO-1082', posting: 'Commitment $21,780' },
  { id: 'inventory', label: 'Inventory', doc: 'GRN-000847', posting: 'Stock +$21,780 · GR/IR' },
  { id: 'production', label: 'Production', doc: 'WO-2048', posting: 'WIP +$15,640' },
  { id: 'cost', label: 'Cost', doc: 'Order costing', posting: 'COGS $106,580' },
  { id: 'invoice', label: 'Invoice', doc: 'INV-7712', posting: 'Receivable $186,750' },
  { id: 'gl', label: 'General Ledger', doc: 'Period 09', posting: 'Balanced, nothing re-keyed' },
]

export type FinanceKpi = {
  label: string
  value: number
  format: 'currency-m' | 'currency-k' | 'percent'
  delta: string
  tone: 'ok' | 'info'
}

export const financeKpis: FinanceKpi[] = [
  { label: 'Revenue', value: 2.84, format: 'currency-m', delta: '+8.2% vs Aug', tone: 'ok' },
  { label: 'Production Cost', value: 1.62, format: 'currency-m', delta: '+3.1% vs Aug', tone: 'info' },
  { label: 'Gross Margin', value: 42.9, format: 'percent', delta: '+1.4 pts', tone: 'ok' },
  { label: 'Receivables', value: 384, format: 'currency-k', delta: '-6.0% vs Aug', tone: 'ok' },
]

export const costBreakdown = [
  { label: 'Material', value: 62, color: '#4C8DFF' },
  { label: 'Labour', value: 19, color: '#22D3EE' },
  { label: 'Machine', value: 13, color: '#A78BFA' },
  { label: 'Overhead', value: 6, color: '#FBBF24' },
]
