// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Houses, HousesData, HousesPatch, HousesQuery, HousesService } from './houses.class'

export type { Houses, HousesData, HousesPatch, HousesQuery }

export type HousesClientService = Pick<HousesService<Params<HousesQuery>>, (typeof housesMethods)[number]>

export const housesPath = 'houses'

export const housesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const housesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(housesPath, connection.service(housesPath), {
    methods: housesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [housesPath]: HousesClientService
  }
}
