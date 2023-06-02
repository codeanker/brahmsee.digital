// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  roomsDataValidator,
  roomsPatchValidator,
  roomsQueryValidator,
  roomsResolver,
  roomsExternalResolver,
  roomsDataResolver,
  roomsPatchResolver,
  roomsQueryResolver
} from './rooms.schema'

import type { Application } from '../../declarations'
import { RoomsService, getOptions } from './rooms.class'
import { roomsPath, roomsMethods } from './rooms.shared'

export * from './rooms.class'
export * from './rooms.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const rooms = (app: Application) => {
  // Register our service on the Feathers application
  app.use(roomsPath, new RoomsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: roomsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(roomsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(roomsExternalResolver),
        schemaHooks.resolveResult(roomsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(roomsQueryValidator), schemaHooks.resolveQuery(roomsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(roomsDataValidator), schemaHooks.resolveData(roomsDataResolver)],
      patch: [schemaHooks.validateData(roomsPatchValidator), schemaHooks.resolveData(roomsPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [roomsPath]: RoomsService
  }
}
