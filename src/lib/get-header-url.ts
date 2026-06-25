const LABLES: Record<string, string> = {
  admin: 'Dashboard',
  members: 'Members',
  faqs: 'FAQs',
  events: 'Events',
  archives: 'Archives',
  'contact-info': 'Contact',
  alumnis: 'Alumnis',
  'add-member': 'Add Member',
  resources: 'Resources',
}

export function get_formated_label(p: string) {
  return LABLES[p]
}

export function get_crumb_url(url: string) {
  const seg = url.split('/').filter(Boolean)

  return seg.map((p, i) => {
    return {
      curr_url: p,
      full_url: '/' + seg.slice(0, i + 1).join('/'),
      prev_url: i > 0 ? '/' + seg.slice(0, i).join('/') : '',
    }
  })
}
