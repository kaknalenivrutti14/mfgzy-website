import type { FunctionalComponent } from 'vue'
import {
  Boxes,
  ShoppingCart,
  Receipt,
  Factory,
  ClipboardCheck,
  Wrench,
  GitBranch,
  Landmark,
  Users,
} from 'lucide-vue-next'

export type ModuleKey =
  | 'inventory'
  | 'purchasing'
  | 'sales'
  | 'production'
  | 'quality'
  | 'maintenance'
  | 'traceability'
  | 'finance'
  | 'hr'

export type PlatformModule = {
  key: ModuleKey
  name: string
  icon: FunctionalComponent
  blurb: string
  /** Modules that light up with this one — they share the same records. */
  connects: ModuleKey[]
  /** Two or three lines of realistic UI shown inside the card preview. */
  preview: { label: string; value: string; tone?: 'ok' | 'warn' | 'crit' | 'info' }[]
  phase: 1 | 2 | 3 | 4 | 5
}

export const platformModules: PlatformModule[] = [
  {
    key: 'inventory',
    name: 'Inventory',
    icon: Boxes,
    blurb: 'Stock by warehouse, rack, bin, lot and serial — with reservations and valuation.',
    connects: ['purchasing', 'production', 'traceability', 'finance'],
    preview: [
      { label: 'Steel Sheet 304', value: '1,240 KG' },
      { label: 'Bin A-03-12', value: 'Reserved 280 KG', tone: 'warn' },
      { label: 'LOT-2026-0842', value: 'Released', tone: 'ok' },
    ],
    phase: 2,
  },
  {
    key: 'purchasing',
    name: 'Purchasing',
    icon: ShoppingCart,
    blurb: 'Requisition, RFQ, supplier comparison, approval, purchase order and receipt.',
    connects: ['inventory', 'finance', 'quality'],
    preview: [
      { label: 'PO-1082', value: 'Approved', tone: 'ok' },
      { label: 'PO-1083', value: 'Awaiting approval', tone: 'warn' },
      { label: 'Supplier C', value: '5 day lead time' },
    ],
    phase: 2,
  },
  {
    key: 'sales',
    name: 'Sales',
    icon: Receipt,
    blurb: 'Quotations, sales orders and delivery commitments that feed the production plan.',
    connects: ['production', 'inventory', 'finance'],
    preview: [
      { label: 'SO-4417', value: '500 units' },
      { label: 'Promise date', value: 'Sep 26' },
      { label: 'ATP check', value: 'Covered', tone: 'ok' },
    ],
    phase: 3,
  },
  {
    key: 'production',
    name: 'Production',
    icon: Factory,
    blurb: 'BOMs, routings, work orders, machine schedule and shop-floor confirmations.',
    connects: ['inventory', 'quality', 'maintenance', 'traceability'],
    preview: [
      { label: 'WO-2048', value: '342 / 500' },
      { label: 'CNC-04', value: 'Running', tone: 'ok' },
      { label: 'Operation', value: 'Machining' },
    ],
    phase: 3,
  },
  {
    key: 'quality',
    name: 'Quality',
    icon: ClipboardCheck,
    blurb: 'Incoming, in-process and final inspection plans, with non-conformance handling.',
    connects: ['production', 'purchasing', 'traceability'],
    preview: [
      { label: 'QC-1028', value: 'Pass 98.8%', tone: 'ok' },
      { label: 'Dimension', value: '±0.05 mm' },
      { label: 'NCR-0074', value: 'Open', tone: 'crit' },
    ],
    phase: 3,
  },
  {
    key: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    blurb: 'Asset register, preventive schedules and breakdown capture against machine time.',
    connects: ['production'],
    preview: [
      { label: 'CNC-04', value: '47 min downtime', tone: 'warn' },
      { label: 'PM-0231', value: 'Due in 3 days' },
      { label: 'MTBF', value: '182 h' },
    ],
    phase: 3,
  },
  {
    key: 'traceability',
    name: 'Traceability',
    icon: GitBranch,
    blurb: 'Forward and backward lot genealogy from raw material receipt to customer shipment.',
    connects: ['inventory', 'production', 'quality'],
    preview: [
      { label: 'LOT-00128', value: '2 batches' },
      { label: 'BATCH-2048', value: 'Shipped', tone: 'info' },
      { label: 'Retrieval', value: '< 60 sec', tone: 'ok' },
    ],
    phase: 3,
  },
  {
    key: 'finance',
    name: 'Finance',
    icon: Landmark,
    blurb: 'Inventory valuation, production cost, payables, receivables and the general ledger.',
    connects: ['inventory', 'purchasing', 'production', 'sales'],
    preview: [
      { label: 'Production cost', value: '$1.62M' },
      { label: 'Gross margin', value: '42.9%', tone: 'ok' },
      { label: 'Receivables', value: '$384K' },
    ],
    phase: 4,
  },
  {
    key: 'hr',
    name: 'HR',
    icon: Users,
    blurb: 'Shifts, attendance and operator skills that decide who can run which operation.',
    connects: ['production'],
    preview: [
      { label: 'Shift B', value: '38 present' },
      { label: 'Certified CNC', value: '12 operators' },
      { label: 'Overtime', value: '4.2%', tone: 'warn' },
    ],
    phase: 4,
  },
]
