import axios from 'axios'
import z from 'zod'

import config from '../../config.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

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

    try {
      const query = await axios.get(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(
          searchText
        )}.json?typeahead=true&limit=5&countrySet=${country}&language=${language}&idxSet=PAD&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&key=${token}`
      )

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

      const parsedSearchResponse = ZTomTomSearchResponse.parse(query.data)

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
    } catch (e) {
      console.error(e)
      return []
    }
  },
})
