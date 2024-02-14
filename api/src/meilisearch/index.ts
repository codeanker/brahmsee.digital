import { MeiliSearch } from 'meilisearch'

import config from '.././config'

/**
 * Initalisiert Meilisearch
 */
const meilisearchConf = config.meilisearch
const meilisearchClient = new MeiliSearch({
  host: meilisearchConf.host,
  apiKey: meilisearchConf.apiKey,
})

/**
 * definiert die RankingRules und filterableAttributes
 * @see https://www.meilisearch.com/docs/learn/configuration/settings
 */
const updateSettings = {
  rankingRules: ['words', 'exactness', 'proximity', 'updatedAt:desc', 'createdAt:desc'],
  filterableAttributes: ['gliederung'],
}

export { meilisearchClient, updateSettings }
