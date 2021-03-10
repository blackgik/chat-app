const Filter = require('bad-words')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInASpecificRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const PublicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(PublicDirectoryPath))

io.on('connection', (socket)=> {
    console.log('web socket is listening')
    // telling all users that a someone just joined
    
    socket.on('join', (options, callback)=> {
        const { error, user} = addUser({id: socket.id, ...options})

        if(error) {
            return callback(error)
        }
    
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${ user.username } just joined`) )
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInASpecificRoom(user.room)
        })
    })
    // listening to messages to send to other clients
    socket.on('message', (message, callback)=> {
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('sorry foul language is not allowed on this application')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    // listening to shared location and sd=ending to other clients
    socket.on('sharedLocation', ({latitude, longitude}, callback)=> {
        const user = getUser(socket.id)

        if(!latitude|| !longitude) {
            return callback('sorry invalid location')
        }

        io.to(user.room).emit('location', generateLocationMessage(user.username, [latitude,longitude]))
        callback()
    })

    // disconnecting a user when a user logs out
    socket.on('disconnect', ()=> {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message',generateMessage(`${user.username} left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInASpecificRoom(user.room)
            })
        }
        
    })
})

server.listen(port, ()=> {
    console.log(`server is up on port ${port}`)
})