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
    return users.find((user)=> {
        if(user.id === id) {
            return user
        }
    })
}

addUser({
    id:22,
    username: 'john',
    room: 'jews'
})

addUser({
    id:13,
    username: 'dave',
    room: 'jews'
})

addUser({
    id:65,
    username: 'john',
    room: 'daniel city'
})


console.log(users)
const usr = getUser(22)
console.log(usr)
// const removedUser = removeUser(22)
// console.log(removedUser)
// console.log(users)

