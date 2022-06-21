import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import sqlite3 from 'sqlite3'

import { IClientEvents, IServerEvents } from './events'

const db = sqlite3.verbose();
const banco = new db.Database("./database/banco3.db"); 
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
    banco.run(`insert into message(message) values ('${message}') `)
    console.log('backend 2', message)
    callback('chegou aqui')
  })
})

httpServer.on('listening', () => {
  // banco.run('drop table if exists message')
  banco.run('create table if not exists message(id integer primary key  autoincrement , message varchar not null)')
})

httpServer.listen(port, () => console.log(`Running on port: ${port}`))
