import { Role } from '@prisma/client'
import type { MultiSearchQuery } from 'meilisearch'
import z from 'zod'

import { meilisearchClient } from '../../meilisearch/index.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const searchProcedure = defineProtectedQueryProcedure({
  key: 'search',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
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

    if (options.ctx.account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

      if (gliederung.id !== null) {
        query.filter = [`gliederung.id=${gliederung.id}`]
      }
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
