export type FlowStage = {
  id: string
  label: string
  /** Owning department — drives the colour band on the rail. */
  lane: 'demand' | 'purchasing' | 'warehouse' | 'production' | 'quality' | 'finance'
  doc: string
  /** What the ERP actually records at this step. */
  effect: string
  rows: { label: string; value: string; tone?: 'ok' | 'warn' | 'crit' | 'info' }[]
}

/** The spine of the site: one order walked from demand to cash. */
export const flowStages: FlowStage[] = [
  {
    id: 'demand',
    label: 'Demand',
    lane: 'demand',
    doc: 'SO-4417',
    effect: 'Sales order creates independent demand for 500 units.',
    rows: [
      { label: 'Customer', value: 'Nordwerk GmbH' },
      { label: 'Product', value: 'Industrial Gear Assembly' },
      { label: 'Quantity', value: '500 units' },
      { label: 'Required', value: 'Sep 26', tone: 'info' },
    ],
  },
  {
    id: 'requisition',
    label: 'Purchase Requisition',
    lane: 'purchasing',
    doc: 'PR-0912',
    effect: 'MRP nets demand against stock and raises a requisition for the shortfall.',
    rows: [
      { label: 'Material', value: 'Steel Sheet 304' },
      { label: 'Shortfall', value: '1,800 KG', tone: 'warn' },
      { label: 'Need by', value: 'Sep 14' },
    ],
  },
  {
    id: 'rfq',
    label: 'RFQ',
    lane: 'purchasing',
    doc: 'RFQ-0338',
    effect: 'Three suppliers quoted on the same line, compared on price, lead time and rating.',
    rows: [
      { label: 'Supplier A', value: '$12.40 · 7 d' },
      { label: 'Supplier B', value: '$11.90 · 12 d' },
      { label: 'Supplier C', value: '$12.10 · 5 d', tone: 'ok' },
    ],
  },
  {
    id: 'po',
    label: 'Purchase Order',
    lane: 'purchasing',
    doc: 'PO-1082',
    effect: 'Approved by the purchase manager; the commitment is visible to finance immediately.',
    rows: [
      { label: 'Supplier', value: 'Supplier C' },
      { label: 'Value', value: '$21,780' },
      { label: 'Approval', value: 'Maria Chen', tone: 'ok' },
    ],
  },
  {
    id: 'grn',
    label: 'Goods Receipt',
    lane: 'warehouse',
    doc: 'GRN-000847',
    effect: 'Received quantity is booked against the PO line and a lot number is assigned.',
    rows: [
      { label: 'Received', value: '1,800 KG' },
      { label: 'Lot', value: 'LOT-2026-0842' },
      { label: 'Inspection', value: 'Incoming QC', tone: 'info' },
    ],
  },
  {
    id: 'warehouse',
    label: 'Warehouse',
    lane: 'warehouse',
    doc: 'Plant 01',
    effect: 'Stock is put away to a bin; the balance and valuation update in the same transaction.',
    rows: [
      { label: 'Bin', value: 'A-03-12' },
      { label: 'On hand', value: '1,240 KG' },
      { label: 'Valuation', value: '$14,532' },
    ],
  },
  {
    id: 'bom',
    label: 'BOM',
    lane: 'production',
    doc: 'BOM-GEAR-A / v4',
    effect: 'The released bill of material and routing decide what gets consumed and where.',
    rows: [
      { label: 'Components', value: '14 lines' },
      { label: 'Steel per unit', value: '3.2 KG' },
      { label: 'Routing', value: '4 operations' },
    ],
  },
  {
    id: 'wo',
    label: 'Production Order',
    lane: 'production',
    doc: 'WO-2048',
    effect: 'Work order released to CNC-04 with material reserved against the order.',
    rows: [
      { label: 'Target', value: '500 units' },
      { label: 'Machine', value: 'CNC-04' },
      { label: 'Status', value: 'Released', tone: 'ok' },
    ],
  },
  {
    id: 'consumption',
    label: 'Material Consumption',
    lane: 'production',
    doc: 'ISS-2048-01',
    effect: 'Issuing material decrements stock and writes the lot into the batch genealogy.',
    rows: [
      { label: 'Issued', value: '1,094 KG' },
      { label: 'From lot', value: 'LOT-2026-0842' },
      { label: 'Batch', value: 'BATCH-2048' },
    ],
  },
  {
    id: 'qc',
    label: 'Quality Inspection',
    lane: 'quality',
    doc: 'QC-1028',
    effect: 'In-process inspection records measured values against the tolerance plan.',
    rows: [
      { label: 'Dimension', value: 'Pass', tone: 'ok' },
      { label: 'Surface', value: 'Pass', tone: 'ok' },
      { label: 'Result', value: '98.8%', tone: 'ok' },
    ],
  },
  {
    id: 'fg',
    label: 'Finished Goods',
    lane: 'warehouse',
    doc: 'FG Store',
    effect: 'Confirmed output is received into finished goods with the batch attached.',
    rows: [
      { label: 'Produced', value: '498 units' },
      { label: 'Scrap', value: '2 units', tone: 'warn' },
      { label: 'Batch', value: 'BATCH-2048' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    lane: 'warehouse',
    doc: 'DN-3391',
    effect: 'Picking consumes the batch, so the shipment is traceable to the raw material lot.',
    rows: [
      { label: 'Shipped', value: '498 units' },
      { label: 'Customer', value: 'Nordwerk GmbH' },
      { label: 'Carrier', value: 'DB Schenker' },
    ],
  },
  {
    id: 'invoice',
    label: 'Invoice',
    lane: 'finance',
    doc: 'INV-7712',
    effect: 'Invoice is raised from the delivery, not re-keyed — quantities cannot drift.',
    rows: [
      { label: 'Net', value: '$186,750' },
      { label: 'Terms', value: 'Net 30' },
      { label: 'Cost of goods', value: '$106,580' },
    ],
  },
  {
    id: 'payment',
    label: 'Payment',
    lane: 'finance',
    doc: 'RCPT-2219',
    effect: 'Receipt clears the receivable and closes the loop that started with demand.',
    rows: [
      { label: 'Received', value: '$186,750', tone: 'ok' },
      { label: 'Days to cash', value: '27' },
      { label: 'Order margin', value: '42.9%', tone: 'ok' },
    ],
  },
]

export const laneMeta: Record<FlowStage['lane'], { name: string; color: string }> = {
  demand: { name: 'Sales', color: '#60A5FA' },
  purchasing: { name: 'Purchasing', color: '#A78BFA' },
  warehouse: { name: 'Warehouse', color: '#22D3EE' },
  production: { name: 'Production', color: '#4C8DFF' },
  quality: { name: 'Quality', color: '#34D399' },
  finance: { name: 'Finance', color: '#FBBF24' },
}
