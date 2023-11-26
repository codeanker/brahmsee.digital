import type { TKontaktInput } from './kontaktInput'

export function getNotfallkontakte(
  notfallkontaktPersonen: TKontaktInput[],
  erziehungsberechtigtePersonen: TKontaktInput[] | undefined
) {
  const notfallkontakte = [...notfallkontaktPersonen]
  if (erziehungsberechtigtePersonen) {
    notfallkontakte.push(
      ...erziehungsberechtigtePersonen.map((kontakt) => ({
        ...kontakt,
        istErziehungsberechtigt: true,
      }))
    )
  }
  return notfallkontakte
}
