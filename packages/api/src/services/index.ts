import { rooms } from './rooms/rooms'
import { user } from './users/users'
import { houses } from './houses/houses'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const services = (app: Application) => {
  app.configure(rooms)
  app.configure(user)
  app.configure(houses)
  // All services will be registered here
}
