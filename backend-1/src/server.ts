import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import sqlite3 from 'sqlite3'
import { IClientEvents, IServerEvents } from './events'
const fila = [];
const db = sqlite3.verbose();
const banco = new db.Database("./database/banco2.db");
const port = 5000
const app = express()
const httpServer = createServer(app)
const server = new Server<IClientEvents, IServerEvents>(httpServer, {
  cors: { origin: ['http://localhost:3000'] },
})
const backend_2 = io('http://localhost:5001')

backend_2.on('disconnect',()=>{
  console.log('desconectado')
})

backend_2.on('connect',()=>{
  if(fila.length > 0){
    fila.forEach( message => {

      backend_2.timeout(1000).emit('message:repass', message,(
        err: any) => {
        if (err) {
          console.log('fila: ', fila)
        }
        else {
          const obj = JSON.parse(fila.shift())
          server.emit("message:success",  obj.message + " gravado com sucesso ");
          console.log(fila.length)
        }
      })
    })
  }
})

server.on('connection', socket => {
  console.log('connected')
  /* A -> B */
  socket.on('message:send', (message, callback) => {
    console.log('backend 1', message)

    const obj = JSON.parse(message)

    banco.run(`insert into message(message, coordX, coordY) values ('${obj.message}', '${obj.coordX}', '${obj.coordY}') `)

    
    /* B -> C */
    enviarSegundoDB(message, callback)

  })
})

  function enviarSegundoDB (message:any, callback?:any){
    backend_2.timeout(1000).emit('message:repass', message, (
      err: any, response: any) => {
      if (err) {
        fila.push(message)
        callback("ocorreu algum erro no processo")
        console.log('fila: ', fila)

      }
      else {
        callback(response)
      }
    })
  }

httpServer.on('listening', () => {
  // banco.run('drop table if exists message')
  banco.run('create table if not exists message(id integer primary key  autoincrement , message varchar(512) not null, coordX varchar not null, coordY varchar not null)')
})
httpServer.listen(port, () => console.log(`Running on port: ${port}`))
