const socket = io()
const formId = document.forms['chat-input']
const inputField = formId.querySelector('input[type=text')
const shareLocation = document.querySelector('#share-location')
const FormButton = formId.querySelector('#send-message')
const messageContainer = document.querySelector('#message-container')
const sidebar = document.querySelector('#sidebar')

// templates
const $messsageTemplates = document.querySelector('#message-scripter').innerHTML
const $locationTemplate = document.querySelector('#location-scripter').innerHTML
const $sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true })

// autoscrolling
const autoScroll = () => {
    // seeing the last messsage each time a user gets a new message
    const $newMessage = messageContainer.lastElementChild

    // checking the height of the messages
    const $newMessageStyles = getComputedStyle($newMessage)
    const $newMessageMargin = parseInt($newMessageStyles.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin
    
    // visible height
    const $visibleHeight = messageContainer.offsetHeight

    // height of message container
    const $constainerHeight = messageContainer.scrollHeight

    // howfar have I scrolled
    const $scrollOffset = messageContainer.scrollTop + $visibleHeight

    if($constainerHeight-$newMessageHeight <= $scrollOffset) {
        messageContainer.scrollTop = messageContainer.scrollHeight
    } 

}

// listening to all messages
socket.on('message', (message)=> {
    const html = Mustache.render($messsageTemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messageContainer.insertAdjacentHTML('beforeend', html)
    autoScroll()

})

// list of users in the chat room
socket.on('roomData', ({room, users})=> {
    const html = Mustache.render($sideBarTemplate, {
        room,
        users
    })

    sidebar.innerHTML = html
})

// emiting the username and the room
socket.emit('join', { username, room}, (error)=> {
    if (error){
        alert(error)
        return location.href = '/'
    }
})

// listening to all shared location

socket.on('location', (location)=> {
    const locate =`https://www.google.com/maps?q=${location.url[0]},${location.url[1]}`
    console.log(locate)
    const html = Mustache.render($locationTemplate, {
        username:location.username,
        locate,
        createdAt: moment(location.createdAt).format('h:mm a')
    })

    messageContainer.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

/**
 * 
 * @DESC Adding event listeners on the form to listen for an action 
 * to carry out a function
 * 
 * **/ 
formId.addEventListener('submit', (e)=> {
    e.preventDefault()

    // didable form button after submittion
    FormButton.disabled = true

    socket.emit('message',inputField.value, (error)=> {
        FormButton.disabled = false
        inputField.value = ''
        inputField.focus()

        if(error) {
          return  console.log(error)
        }

        console.log('delivered!')


    })
    
})

// sharing location to the server for other users to use
shareLocation.addEventListener('click', (e)=> {
    const geo = navigator.geolocation

    if(!geo) {
       return  console.log('it is an unknown persons location')
    }
    
    geo.getCurrentPosition((position) => {
        socket.emit('sharedLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error)=> {
            if(error) {
                return console.log(error)
            }

            console.log('location shared')
        })
    
    })
})