import rest from '@feathersjs/rest-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { createClient } from '@codeanker/api'

const apiEndpoint = '/api'
const restClient = rest(apiEndpoint).fetch(window.fetch.bind(window))
const socketClient = io(apiEndpoint.replace('/api', ''), { transports: ['websocket'], path: '/api/socket.io' })

export const featherClient = createClient(restClient)
export const featherSocketClient = createClient(socketio(socketClient))
