import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { IClientEvents, IServerEvents } from './events'

const port = 5001
const app = express()
const httpServer = createServer(app)
const io = new Server<IClientEvents, IServerEvents>(httpServer, {
  cors: { origin: ['http://localhost:5000'] },
})

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

/* Conexão A -> B */
io.on('connection', socket => {
  console.log('connected')

  socket.on('message:repass', (message, callback) => {
    console.log('backend 2', message)
    callback('chegou aqui')
  })
})

httpServer.listen(port, () => console.log(`Running on port: ${port}`))
