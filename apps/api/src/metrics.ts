import prom from 'prom-client'

export const register = new prom.Registry()
prom.collectDefaultMetrics({ register })

export const trpc_call_duration = new prom.Histogram({
  name: 'trpc_call_duration',
  help: 'trpc_call_duration',
  buckets: [0.1, 5, 15, 50, 100, 500],
  labelNames: ['path', 'subdomain'],
  registers: [register],
})
