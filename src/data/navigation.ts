export type NavItem = { label: string; hash: string; blurb: string }

/** Nav targets are section ids on the landing page — no dead routes. */
export const primaryNav: NavItem[] = [
  { label: 'Platform', hash: '#platform', blurb: 'Nine modules, one record' },
  { label: 'Manufacturing', hash: '#flow', blurb: 'Demand to payment' },
  { label: 'Solutions', hash: '#shop-floor', blurb: 'Operators, planners, controllers' },
  { label: 'Industries', hash: '#industries', blurb: 'Eight manufacturing models' },
  { label: 'Security', hash: '#security', blurb: 'Tenant isolation and audit' },
  // Pricing is not published yet — restore alongside PricingSection in HomeView.
  // { label: 'Pricing', hash: '#pricing', blurb: 'Plans and usage limits' },
  { label: 'Resources', hash: '#roadmap', blurb: 'Roadmap and documentation' },
]

export const footerNav: { title: string; links: { label: string; hash: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Platform', hash: '#platform' },
      { label: 'Inventory', hash: '#inventory' },
      { label: 'Purchasing', hash: '#procurement' },
      { label: 'Production', hash: '#planning' },
      { label: 'Quality', hash: '#quality' },
      { label: 'Traceability', hash: '#traceability' },
      { label: 'Finance', hash: '#finance' },
      { label: 'Security', hash: '#security' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Furniture', hash: '#industries' },
      { label: 'Textile', hash: '#industries' },
      { label: 'Plastics', hash: '#industries' },
      { label: 'Electronics', hash: '#industries' },
      { label: 'Food', hash: '#industries' },
      { label: 'Steel', hash: '#industries' },
      { label: 'Pharmaceutical', hash: '#industries' },
      { label: 'Automotive', hash: '#industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', hash: '#platform' },
      { label: 'Contact', hash: '#cta' },
      { label: 'Careers', hash: '#cta' },
      { label: 'Security', hash: '#security' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', hash: '#roadmap' },
      { label: 'Blog', hash: '#roadmap' },
      { label: 'Guides', hash: '#import' },
      { label: 'API', hash: '#tenancy' },
    ],
  },
]

export const legalNav = [
  { label: 'Privacy', hash: '#security' },
  { label: 'Terms', hash: '#security' },
  { label: 'Security', hash: '#security' },
]
