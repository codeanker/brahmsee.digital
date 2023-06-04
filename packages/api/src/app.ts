// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'

import { authenticate } from '@feathersjs/authentication'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(channels)
app.configure(mongodb)
app.configure(authentication)
app.configure(services)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {
    all: [
      async (context) => {
        if (context.params.provider && context.path !== 'authentication') {
          try {
            context = await authenticate('jwt')(context)
          } catch (error: any) {
            if (error.name !== 'NotAuthenticated') throw new Error(error)
          }
          // context = await checkAbilities()(context)
        }
      }
      // when((hook) => hook.params.provider && hook.path !== 'authentication', [authenticate, checkAbilities()])
    ]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
