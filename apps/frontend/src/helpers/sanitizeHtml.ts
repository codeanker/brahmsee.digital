import doSanitizeHtml from 'sanitize-html'

export function sanitizeHtml(html?: string | null): string {
  if (!html) {
    return ''
  }

  return doSanitizeHtml(html, {
    allowedTags: [
      'h2',
      'h3',
      'p',
      'strong',
      'em',
      's',
      'u',
      'a',
      'ul',
      'ol',
      'li',
      'img',
    ],
    allowedAttributes: {
      img: [
        'src', 'alt', 'style',
      ],
    },
  })
}
