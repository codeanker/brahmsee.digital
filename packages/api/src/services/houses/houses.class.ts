// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Houses, HousesData, HousesPatch, HousesQuery } from './houses.schema'

export type { Houses, HousesData, HousesPatch, HousesQuery }

export interface HousesParams extends MongoDBAdapterParams<HousesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class HousesService<ServiceParams extends Params = HousesParams> extends MongoDBService<
  Houses,
  HousesData,
  HousesParams,
  HousesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('houses'))
  }
}
