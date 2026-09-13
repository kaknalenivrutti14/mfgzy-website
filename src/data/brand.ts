/**
 * Single source of truth for product identity. The wordmark is split so the
 * "ZY" can carry the accent colour the way the logo artwork does; renaming the
 * product means editing `markLead`/`markTail` here plus the <title> and
 * OpenGraph tags in index.html.
 *
 * Note: the supplied logo file (public/logo-mark.png is cropped from it) spells
 * the wordmark "MGFZY". That is a transposition in the artwork — the product is
 * MFGZY, from MFG (manufacturing) + ZY (Zenzy's) — so the site sets the
 * wordmark as live text and uses only the icon from the file.
 */
export const brand = {
  name: 'MFGZY',
  markLead: 'MFG',
  markTail: 'ZY',
  company: "Zenzy's",
  tagline: 'Manufacturing ERP built for the factory floor.',
  subline:
    'Connect purchasing, inventory, production, quality, traceability and finance in one intelligent manufacturing platform.',
  audience: 'Built for manufacturers with 50–1,000 employees.',
  /** Shown under the footer wordmark, matching the logo lockup. */
  descriptor: "Manufacturing Web Applications created by Zenzy's",
} as const

export const contact = {
  email: 'nivrutti.kaknale@gmail.com',
  team: 'MFGZY team',
} as const

/**
 * Builds a `mailto:` the visitor's mail client opens with the subject and a
 * skeleton body already filled in, so an enquiry arrives with the details the
 * team needs rather than as an empty "interested, call me".
 *
 * URLSearchParams encodes a space as "+", which mail clients render literally,
 * so those are converted back to %20.
 */
function mailto(subject: string, lines: string[]): string {
  const query = new URLSearchParams({ subject, body: lines.join('\n') })
  return `mailto:${contact.email}?${query.toString().replace(/\+/g, '%20')}`
}

const SIGN_OFF = ['', 'Name:', 'Role:', 'Company phone:', '']

export const cta = {
  trial: {
    label: 'Start Free Trial',
    to: mailto(`Free trial request — ${brand.name} Manufacturing ERP`, [
      `Hello ${contact.team},`,
      '',
      `We would like to start a free trial of ${brand.name}.`,
      '',
      'Company:',
      'Industry (furniture / textile / plastics / electronics / food / steel / pharma / automotive):',
      'Number of plants:',
      'Number of employees:',
      'Systems used today:',
      'Preferred start date:',
      ...SIGN_OFF,
    ]),
  },
  demo: {
    label: 'Book a Demo',
    to: mailto(`Demo request — ${brand.name} Manufacturing ERP`, [
      `Hello ${contact.team},`,
      '',
      `We would like to book a demo of ${brand.name}.`,
      '',
      'Company:',
      'Industry:',
      'Number of plants:',
      'Number of employees:',
      'What we would most like to see (inventory / production / quality / traceability / finance):',
      'Preferred days and times:',
      ...SIGN_OFF,
    ]),
  },
  sales: {
    label: 'Contact Sales',
    to: mailto(`Plans and pricing — ${brand.name} Manufacturing ERP`, [
      `Hello ${contact.team},`,
      '',
      `We would like to talk about ${brand.name} plans and pricing.`,
      '',
      'Company:',
      'Number of plants:',
      'Number of users:',
      'Modules of interest:',
      ...SIGN_OFF,
    ]),
  },

  // Sign-in is hidden until the application has a public sign-in URL to point
  // at. Restore the nav entries in SiteNavbar.vue alongside this.
  // signIn: { label: 'Sign in', to: '/get-started?intent=sign-in' },
} as const
