import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

function App() {
  // const [message, setMessage] = useState('')

  const [obj, setObj] = useState({
    message: '',
    coordX: '167,00',
    coordY: '-47,00',
  })
  const [socket, setSocket] = useState<Socket>()
  const connectedRef = useRef(false)

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    if (!socket) return

    socket.emit('message:send', JSON.stringify(obj), (response: any) => {
      alert(response)
    })

    console.log(obj)
  }

  useEffect(() => {
    if (connectedRef.current) return

    const connection = io('http://localhost:5000')

    setSocket(connection)
    connection.on('message:success', message => {
      console.log(message)
    })

    connectedRef.current = true
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="message"
        placeholder="Digite sua mensagem..."
        // value={message}
        // onChange={e => setMessage(e.target.value)}
        value={obj.message}
        onChange={e =>
          setObj({
            message: e.target.value,
            coordX: '145,00',
            coordY: '-47,00',
          })
        }
      />
      <button type="submit">Enviar</button>
    </form>
  )
}

export default App
