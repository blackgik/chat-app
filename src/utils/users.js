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

console.log(addUser({
    id:32,
    username: 'brian',
    room: 'jews'
}))

console.log(addUser({
    id:32,
    username: 'brian',
    room: 'jews'
}))