/* Trust metrics ------------------------------------------------------------ */

export type Metric = {
  value: number
  /** Rendered around the counted number. */
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
  note: string
}

/** Targets, stated as targets — not customer results we do not have yet. */
export const trustMetrics: Metric[] = [
  { value: 30, suffix: ' Days', label: 'Target time-to-value', note: 'Master data loaded, first plant transacting' },
  { value: 98, suffix: '%+', label: 'Inventory accuracy target', note: 'Measured by cycle-count variance' },
  { value: 60, prefix: '< ', suffix: ' sec', label: 'Lot genealogy retrieval', note: 'Forward and backward, any lot' },
  { value: 1, suffix: ' Platform', label: 'One operational record', note: 'No reconciliation between systems' },
]

/* Problem section ---------------------------------------------------------- */

export const brokenStack = [
  { label: 'Spreadsheet', detail: 'Stock counted last Tuesday' },
  { label: 'Legacy ERP', detail: 'Postings nobody can trace' },
  { label: 'Paper', detail: 'Shop-floor counts, keyed in Friday' },
  { label: 'Email', detail: 'Supplier confirmations in an inbox' },
  { label: 'Manual reconciliation', detail: 'Three days, every month end' },
]

export const brokenSymptoms = [
  'Inventory that is right on screen and wrong on the rack',
  'Purchasing decisions made on last week’s numbers',
  'No answer to “where is that order?” without a phone call',
  'A recall that takes two days of spreadsheet archaeology',
  'Month-end spent reconciling instead of closing',
]

export const connectedOutcomes = [
  { label: 'Inventory', detail: 'Balances move when material moves' },
  { label: 'Production', detail: 'Confirmations come from the machine' },
  { label: 'Quality', detail: 'Results attached to the batch' },
  { label: 'Finance', detail: 'Cost posted from the same document' },
]

/* Bulk import -------------------------------------------------------------- */

export const importSteps = [
  { id: 'excel', label: 'Excel', detail: 'Your item master, as it is today' },
  { id: 'upload', label: 'Upload', detail: 'XLSX or CSV, up to 50,000 rows' },
  { id: 'validate', label: 'Validate', detail: 'Types, duplicates, missing references' },
  { id: 'map', label: 'Map Columns', detail: 'Saved as a reusable mapping' },
  { id: 'preview', label: 'Preview', detail: 'See exactly what will be created' },
  { id: 'import', label: 'Import', detail: 'Transactional — partial failure rolls back' },
  { id: 'erp', label: 'ERP', detail: 'Auditable, attributed to the importer' },
]

export const importResult = {
  imported: 1842,
  warnings: 17,
  errors: 0,
  file: 'item-master-2026.xlsx',
  warningSample: [
    { row: 'Row 218', message: 'Unit “PCS.” normalised to “pcs”' },
    { row: 'Row 964', message: 'Lead time missing — supplier default of 7 days used' },
    { row: 'Row 1,502', message: 'Duplicate SKU skipped: RM-STL-304-2MM' },
  ],
}

/* Roadmap ------------------------------------------------------------------ */

export type Phase = {
  id: string
  name: string
  status: 'delivered' | 'in-progress' | 'planned'
  items: string[]
  note: string
}

/** Mirrors the product's real sequencing: phases 1–2 are built, 3–5 are not. */
export const roadmap: Phase[] = [
  {
    id: 'PHASE 1',
    name: 'Platform',
    status: 'delivered',
    items: ['Multi-tenant core', 'Identity and roles', 'Organisation and plants', 'Audit trail'],
    note: 'The foundation every other module is built on.',
  },
  {
    id: 'PHASE 2',
    name: 'Warehouse & Purchasing',
    status: 'delivered',
    items: ['Item master', 'Inventory and bins', 'Requisition to receipt', 'Supplier master'],
    note: 'Material in, material located, material valued.',
  },
  {
    id: 'PHASE 3',
    name: 'Manufacturing',
    status: 'in-progress',
    items: ['Production', 'Quality', 'Traceability', 'Maintenance'],
    note: 'BOMs, routings, work orders and lot genealogy.',
  },
  {
    id: 'PHASE 4',
    name: 'Finance & HR',
    status: 'planned',
    items: ['Costing', 'Payables and receivables', 'General ledger', 'Shifts and attendance'],
    note: 'Production and finance on one set of documents.',
  },
  {
    id: 'PHASE 5',
    name: 'Intelligence',
    status: 'planned',
    items: ['Demand forecasting', 'Predictive maintenance', 'Document OCR', 'ERP assistant'],
    note: 'Recommendations on top of data the ERP already holds.',
  },
]

/* AI assistant ------------------------------------------------------------- */

export const assistantExchange = {
  question: 'Why is production order WO-2048 delayed?',
  headline: 'WO-2048 is currently 6 hours behind schedule.',
  reasons: [
    {
      title: 'Material shortage',
      detail: 'Steel 304 is 180 KG short against the released quantity.',
      source: 'Inventory · A-03-12',
    },
    {
      title: 'CNC-04 downtime',
      detail: '47 minutes of unplanned downtime recorded today.',
      source: 'Maintenance · CNC-04',
    },
    {
      title: 'Supplier delay',
      detail: 'Expected arrival moved from Sep 12 to Sep 14.',
      source: 'Purchasing · PO-1082',
    },
  ],
  actions: [
    'Expedite Supplier B',
    'Move WO-2048 to CNC-02',
    'Release alternate material',
  ],
  disclaimer:
    'Planned for Phase 5. Every answer cites the records it came from, and recommendations stay recommendations until a person approves them.',
}

/* Pricing ------------------------------------------------------------------ */

export type Plan = {
  key: string
  name: string
  summary: string
  /** Deliberately unset — no invented price points. */
  price: string
  priceNote: string
  limits: { label: string; value: string }[]
  features: string[]
  highlighted?: boolean
  cta: 'trial' | 'sales'
}

export const plans: Plan[] = [
  {
    key: 'starter',
    name: 'Starter',
    summary: 'One plant getting off spreadsheets.',
    price: 'Pricing on request',
    priceNote: 'Per user, billed annually',
    limits: [
      { label: 'Users', value: 'Up to 15' },
      { label: 'Plants', value: '1' },
      { label: 'Warehouses', value: '2' },
      { label: 'Storage', value: '25 GB' },
    ],
    features: ['Inventory', 'Purchasing', 'Item master', 'Bulk import', 'Email support'],
    cta: 'trial',
  },
  {
    key: 'growth',
    name: 'Growth',
    summary: 'A plant running production on the system.',
    price: 'Pricing on request',
    priceNote: 'Per user, billed annually',
    limits: [
      { label: 'Users', value: 'Up to 50' },
      { label: 'Plants', value: '2' },
      { label: 'Warehouses', value: '5' },
      { label: 'Storage', value: '100 GB' },
    ],
    features: [
      'Everything in Starter',
      'Production and BOMs',
      'Quality inspections',
      'Lot traceability',
      'Standard support',
    ],
    highlighted: true,
    cta: 'trial',
  },
  {
    key: 'professional',
    name: 'Professional',
    summary: 'Several plants, one operational record.',
    price: 'Pricing on request',
    priceNote: 'Per user, billed annually',
    limits: [
      { label: 'Users', value: 'Up to 250' },
      { label: 'Plants', value: '5' },
      { label: 'Warehouses', value: '20' },
      { label: 'Storage', value: '500 GB' },
    ],
    features: [
      'Everything in Growth',
      'Maintenance',
      'Finance and costing',
      'Advanced approvals',
      'Priority support',
    ],
    cta: 'sales',
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    summary: 'Group-wide rollout with its own contract.',
    price: 'Custom',
    priceNote: 'Contracted annually',
    limits: [
      { label: 'Users', value: 'Unlimited' },
      { label: 'Plants', value: 'Unlimited' },
      { label: 'Warehouses', value: 'Unlimited' },
      { label: 'Storage', value: 'Custom' },
    ],
    features: [
      'Everything in Professional',
      'Dedicated database option',
      'SSO and SCIM',
      'Custom data residency',
      'Named success manager',
    ],
    cta: 'sales',
  },
]

export type UsageMeter = { label: string; used: number; limit: number; unit: string }

export const usageMeters: UsageMeter[] = [
  { label: 'Users', used: 42, limit: 50, unit: '' },
  { label: 'Warehouses', used: 4, limit: 5, unit: '' },
  { label: 'Storage', used: 68, limit: 100, unit: ' GB' },
]
