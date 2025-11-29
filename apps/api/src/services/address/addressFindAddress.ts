import z from 'zod'

import config from '../../config.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

const ZTomTomSearchResponse = z.object({
  summary: z.object({
    numResults: z.number(),
  }),
  results: z.array(
    z.object({
      address: z.object({
        streetName: z.string(),
        streetNumber: z.string(),
        postalCode: z.string(),
        municipality: z.string(),
        countryCode: z.string(),
      }),
      position: z.object({
        lat: z.number(),
        lon: z.number(),
      }),
    })
  ),
})

export const addressFindActionProcedure = definePublicQueryProcedure({
  key: 'findAddress',
  inputSchema: z.object({
    query: z.string().optional(),
    zip: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    country: z.string().optional(),
  }),
  async handler(options) {
    let searchText = ''
    if (options.input.query != null) {
      searchText = options.input.query
    } else {
      if (options.input.zip != null) {
        searchText += options.input.zip
      }
      if (options.input.city != null) {
        searchText += options.input.city
      }
      if (options.input.street != null) {
        searchText += options.input.street
      }
      if (options.input.streetNumber != null) {
        searchText += options.input.streetNumber
      }
    }
    const language = 'NGT'

    const token = config.tomtom.apiKey
    if (!token) {
      console.error('No TomTom API key found')
      return []
    }
    const country = options?.input?.country != null ? options.input.country.toUpperCase() : 'DE'

    const url = new URL(`https://api.tomtom.com/search/2/search/${encodeURIComponent(searchText)}.json`)
    url.searchParams.append('typeahead', 'true')
    url.searchParams.append('limit', '5')
    url.searchParams.append('countrySet', country)
    url.searchParams.append('language', language)
    url.searchParams.append('idxSet', 'PAD')
    url.searchParams.append('minFuzzyLevel', '1')
    url.searchParams.append('maxFuzzyLevel', '2')
    url.searchParams.append('view', 'Unified')
    url.searchParams.append('key', token)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (response.status !== 200) {
      return []
    }

    const body = await response.json()
    const parsedSearchResponse = ZTomTomSearchResponse.parse(body)

    if (parsedSearchResponse.summary.numResults < 1) return []
    return parsedSearchResponse.results.map((result) => {
      return {
        street: result.address.streetName,
        streetNumber: result.address.streetNumber,
        zip: result.address.postalCode,
        city: result.address.municipality,
        country: result.address.countryCode,
        position: result.position,
      }
    })
  },
})
