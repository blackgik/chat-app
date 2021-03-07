const Filter = require('bad-words')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { disconnect } = require('process')
const { callbackify } = require('util')

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
    socket.on('message', (message, callback)=> {
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('sorry foul language is not allowed on this application')
        }

        io.emit('message', message)
        callback()
    })

    // listening to shared location and sd=ending to other clients
    socket.on('sharedLocation', (position)=> {
        io.emit('location', position)
    })

    // disconnecting a user when a user logs out
    socket.on('disconnect', ()=> {
        io.emit('message','user left!')
    })
})

server.listen(port, ()=> {
    console.log(`server is up on port ${port}`)
})