// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Rooms, RoomsData, RoomsPatch, RoomsQuery } from './rooms.schema'

export type { Rooms, RoomsData, RoomsPatch, RoomsQuery }

export interface RoomsParams extends MongoDBAdapterParams<RoomsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class RoomsService<ServiceParams extends Params = RoomsParams> extends MongoDBService<
  Rooms,
  RoomsData,
  RoomsParams,
  RoomsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('rooms'))
  }
}
