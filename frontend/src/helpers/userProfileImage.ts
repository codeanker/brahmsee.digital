import MD5 from 'crypto-js/md5'

export default function (user?: any, size = 50, default_image = 'mp', allowed_rating = 'g', force_default = 'n') {
  return (
    'https://secure.gravatar.com/avatar/' +
    MD5(user?.email?.toLowerCase()?.trim()) +
    '?size=' +
    size +
    '&default=' +
    encodeURIComponent(default_image) +
    '&rating=' +
    allowed_rating +
    (force_default === 'y' ? '&forcedefault=' + force_default : '')
  )
}
