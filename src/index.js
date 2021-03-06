const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const PublicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(PublicDirectoryPath))

io.on('connection', (socket)=> {
    console.log('web socket is listening')
    // telling all users that a someone just joined
    socket.broadcast.emit('message','a new user just joined' )
    
    // listening to messages to send to other clients
    socket.on('message', (message)=> {
        io.emit('message', message)
    })

    socket.on('disconnect', ()=> {
        io.emit('message','user left!')
    })
})

server.listen(port, ()=> {
    console.log(`server is up on port ${port}`)
})