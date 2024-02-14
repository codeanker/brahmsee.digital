import type { MultiSearchQuery } from 'meilisearch'
import z from 'zod'

import { meilisearchClient } from '../../meilisearch'
import { defineProcedure } from '../../types/defineProcedure'

export const searchProcedure = defineProcedure({
  key: 'search',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    term: z.string(),
  }),
  async handler(options) {
    const queries: MultiSearchQuery[] = []
    const query: MultiSearchQuery = {
      indexUid: 'person',
      q: options.input.term,
      attributesToHighlight: ['*'],
      limit: 10,
      showRankingScore: true,
      matchingStrategy: 'all',
    }
    queries.push(query)
    const result = (
      await meilisearchClient.multiSearch({
        queries: queries,
      })
    ).results.filter((entry) => entry.estimatedTotalHits !== undefined)

    const totalResults = result.reduce((total, entry) => total + entry.estimatedTotalHits!, 0)

    return {
      results: result,
      totalResults,
    }
  },
})
