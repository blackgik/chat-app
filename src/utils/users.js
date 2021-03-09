const users = []

// create new users, remove a user, list all users, list all users in the same group, change users usersname

// creating a new user
const addUser = ({id, username, room})=> {
    // trimming the username and the room
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // confirming the username or room name is not empty

    if( !username || !room) {
        return {
            error: 'username and room can not be empty'
        }
    }

    // checking if a user exist in the same room
    const existingUser = users.find((user)=> {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'user already exist'
        } 
    }

    // store users
    const user = {id, username, room}
    users.push(user)

    return { user }

}

// removing a user from the chat room
const removeUser = (id)=> {
    const index = users.findIndex((user)=> user.id == id)

    if(index !== -1) {
       return users.splice(index, 1)[0]
    }
}

const getUser = (id)=> {
    return users.find((user)=> user.id === id)
}

const getUserInASpecificRoom = (room)=> {
    const usersInRoom = users.filter((user) => {
        if(user.room == room) {
            return  user
        }
    })

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInASpecificRoom
}