const socket = io()
const formId = document.forms['chat-input']
const inputField = formId.querySelector('input[type=text')
const shareLocation = document.querySelector('#share-location')

// listening to all messages
socket.on('message', (message)=> {
    console.log(message)
})

// listening to all shared location

socket.on('location', (...location)=> {
    console.log(`you can find me here: ${location}`)
})

/**
 * 
 * @DESC Adding event listeners on the form to listen for an action 
 * to carry out a function
 * 
 * **/ 
formId.addEventListener('submit', (e)=> {
    e.preventDefault()

    socket.emit('message',inputField.value)
    inputField.value = ''
})

// sharing location to the server for other users to use
shareLocation.addEventListener('click', (e)=> {
    const geo = navigator.geolocation

    if(!geo) {
        console.log('it is an unknown persons location')
    }
    
    geo.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        socket.emit('sharedLocation', [latitude, longitude])
    
    })
})