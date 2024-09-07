import axios from 'axios'
import z from 'zod'

import config from '../../config'
import { defineProcedure } from '../../types/defineProcedure'

export const addressFindActionProcedure = defineProcedure({
  key: 'findAddress',
  method: 'query',
  protection: { type: 'public' },
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

    let results

    const token = config.tomtom.apiKey
    if (!token) {
      console.error('No TomTom API key found')
      return []
    }
    const country = options?.input?.country != null ? options.input.country.toUpperCase() : 'DE'

    try {
      const query = await axios.get(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(
          searchText
        )}.json?typeahead=true&limit=5&countrySet=${country}&language=${language}&idxSet=PAD&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&key=${token}`
      )
      if (query.data.summary.numResults < 1) return []
      results = query.data.results.map((result) => {
        return {
          street: result.address.streetName,
          streetNumber: result.address.streetNumber,
          zip: result.address.postalCode,
          city: result.address.municipality,
          country: result.address.countryCode,
          position: result.position,
        }
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return []
    }
    return results
  },
})
