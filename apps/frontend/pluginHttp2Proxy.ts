/**
 * Add Support for http 2.0 for development with vite and speed up requestes
 */

import proxy from 'http2-proxy'
import type { Plugin, ProxyOptions } from 'vite'

export const pluginHttp2Proxy = (): Plugin => {
  let routes: Record<string, string | ProxyOptions>
  return {
    name: 'vite-plugin-http2-proxy',
    config: (config) => {
      const { server } = config
      routes = server?.proxy ?? {}
      if (server) {
        server.proxy = undefined
      }
      return config
    },
    configureServer: ({ config: { logger }, middlewares }) => {
      Object.entries(routes).forEach(([route, proxyConfig]) => {
        let target
        if (typeof proxyConfig === 'string') {
          target = proxyConfig
        } else {
          if (proxyConfig.target === undefined) throw new Error('Target not defined')
          if (typeof proxyConfig.target !== 'string') throw new Error('Target must be string')
          target = proxyConfig.target
        }
        const { protocol, hostname, port } = new URL(target)
        const options = {
          protocol: protocol as 'http' | 'https',
          hostname,
          port: Number(port),
          proxyTimeout: 60000,
        }

        middlewares.use(route, (req, res) => {
          const originalUrl = req.originalUrl ?? ''
          let targetPath: string
          if (typeof proxyConfig === 'string' || proxyConfig.rewrite === undefined) {
            targetPath = originalUrl
          } else {
            targetPath = proxyConfig.rewrite(originalUrl)
          }
          proxy.web(req, res, { ...options, path: targetPath }, (err) => {
            if (err !== null) {
              logger.error(`[http2-proxy] Error when proxying request on '${targetPath}'`, {
                timestamp: true,
                error: err,
              })
            }
          })
        })
      })
    },
  }
}
