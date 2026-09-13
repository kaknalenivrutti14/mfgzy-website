import type { FunctionalComponent } from 'vue'
import {
  Armchair,
  Shirt,
  Beaker,
  CircuitBoard,
  Wheat,
  Hammer,
  Pill,
  Car,
} from 'lucide-vue-next'

export type Industry = {
  key: string
  name: string
  icon: FunctionalComponent
  /** The thing that breaks a generic ERP in this industry. */
  tension: string
  requirements: string[]
  record: { label: string; value: string; tone?: 'ok' | 'warn' | 'info' }[]
}

export const industries: Industry[] = [
  {
    key: 'furniture',
    name: 'Furniture',
    icon: Armchair,
    tension: 'Every order is slightly different, and the routing is long.',
    requirements: ['Configurable products', 'Long routings', 'Made-to-order'],
    record: [
      { label: 'Model', value: 'OAK-DESK-1600' },
      { label: 'Variant', value: 'Walnut / 6 options' },
      { label: 'Routing', value: '9 operations' },
      { label: 'Order type', value: 'Make to order', tone: 'info' },
    ],
  },
  {
    key: 'textile',
    name: 'Textile',
    icon: Shirt,
    tension: 'Stock is measured in rolls and metres, and shade varies by dye lot.',
    requirements: ['Roll / metre units', 'Dye lots', 'Scrap'],
    record: [
      { label: 'Fabric', value: 'COT-220-NAVY' },
      { label: 'Roll', value: 'ROLL-4471 · 84.5 m' },
      { label: 'Dye lot', value: 'DL-2026-118', tone: 'info' },
      { label: 'Scrap', value: '3.4%', tone: 'warn' },
    ],
  },
  {
    key: 'plastics',
    name: 'Plastics',
    icon: Beaker,
    tension: 'The mould, not the machine, is the real constraint on the schedule.',
    requirements: ['Mould scheduling', 'Machine cycles', 'Regrind'],
    record: [
      { label: 'Mould', value: 'MLD-118 · 4 cavity' },
      { label: 'Cycle', value: '28.4 s' },
      { label: 'Machine', value: 'IMM-02' },
      { label: 'Regrind', value: '12% blended', tone: 'warn' },
    ],
  },
  {
    key: 'electronics',
    name: 'Electronics',
    icon: CircuitBoard,
    tension: 'Units are serialised and components go end-of-life mid-programme.',
    requirements: ['Serial tracking', 'Component BOM', 'Obsolescence'],
    record: [
      { label: 'Assembly', value: 'PCB-A4-REV-C' },
      { label: 'Serial', value: 'SN-0048213' },
      { label: 'BOM lines', value: '184 components' },
      { label: 'EOL risk', value: '3 parts', tone: 'warn' },
    ],
  },
  {
    key: 'food',
    name: 'Food Processing',
    icon: Wheat,
    tension: 'Shelf life drives picking, and a recall has to be answered in minutes.',
    requirements: ['Batch', 'Expiry', 'FEFO', 'Recall'],
    record: [
      { label: 'Batch', value: 'BATCH-7741' },
      { label: 'Expiry', value: '2026-11-04' },
      { label: 'Pick rule', value: 'FEFO', tone: 'info' },
      { label: 'Recall scope', value: '2 customers', tone: 'ok' },
    ],
  },
  {
    key: 'steel',
    name: 'Steel',
    icon: Hammer,
    tension: 'Material is costed by weight and certified by heat number.',
    requirements: ['Heat numbers', 'Weight costing', 'Mill certificates'],
    record: [
      { label: 'Heat no.', value: 'HT-88214' },
      { label: 'Grade', value: 'AISI 304' },
      { label: 'Weight', value: '1,240 KG' },
      { label: 'Mill cert', value: 'EN 10204 3.1', tone: 'ok' },
    ],
  },
  {
    key: 'pharma',
    name: 'Pharmaceutical',
    icon: Pill,
    tension: 'Nothing counts unless it is signed, timestamped and unalterable.',
    requirements: ['Electronic signatures', 'Immutable audit', '21 CFR Part 11'],
    record: [
      { label: 'Batch', value: 'BATCH-PH-0912' },
      { label: 'Signed by', value: 'R. Lee · QA' },
      { label: 'Signed at', value: '10:14:02 UTC' },
      { label: 'Audit record', value: 'Immutable', tone: 'ok' },
    ],
  },
  {
    key: 'automotive',
    name: 'Automotive Parts',
    icon: Car,
    tension: 'Customers audit your process, not just your parts.',
    requirements: ['Serial traceability', 'PPAP', 'Supplier scorecards'],
    record: [
      { label: 'Part', value: 'BRK-CAL-R12' },
      { label: 'Serial', value: 'SN-2048-00417' },
      { label: 'PPAP', value: 'Level 3 approved', tone: 'ok' },
      { label: 'Supplier score', value: '96 / 100' },
    ],
  },
]
