import { makeApp } from '../../util/make-app.js'

const oidcRouter = makeApp()

// FIXME: figure out oidc
// oidcRouter.get('/dlrg/callback', connect)

export { oidcRouter }
