// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Rooms, RoomsData, RoomsPatch, RoomsQuery, RoomsService } from './rooms.class'

export type { Rooms, RoomsData, RoomsPatch, RoomsQuery }

export type RoomsClientService = Pick<RoomsService<Params<RoomsQuery>>, (typeof roomsMethods)[number]>

export const roomsPath = 'rooms'

export const roomsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const roomsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(roomsPath, connection.service(roomsPath), {
    methods: roomsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [roomsPath]: RoomsClientService
  }
}
