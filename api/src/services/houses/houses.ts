// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  housesDataValidator,
  housesPatchValidator,
  housesQueryValidator,
  housesResolver,
  housesExternalResolver,
  housesDataResolver,
  housesPatchResolver,
  housesQueryResolver
} from './houses.schema'

import type { Application } from '../../declarations'
import { HousesService, getOptions } from './houses.class'
import { housesPath, housesMethods } from './houses.shared'

export * from './houses.class'
export * from './houses.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const houses = (app: Application) => {
  // Register our service on the Feathers application
  app.use(housesPath, new HousesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: housesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(housesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(housesExternalResolver),
        schemaHooks.resolveResult(housesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(housesQueryValidator), schemaHooks.resolveQuery(housesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(housesDataValidator), schemaHooks.resolveData(housesDataResolver)],
      patch: [schemaHooks.validateData(housesPatchValidator), schemaHooks.resolveData(housesPatchResolver)],
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
    [housesPath]: HousesService
  }
}
