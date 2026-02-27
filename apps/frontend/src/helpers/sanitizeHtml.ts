import doSanitizeHtml from 'sanitize-html'

export function sanitizeHtml(html: string): string {
  return doSanitizeHtml(html, {
    allowedTags: [
      'p',
      'strong',
      'em',
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
