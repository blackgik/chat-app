const socket = io()
const formId = document.forms['chat-input']
const inputField = formId.querySelector('input[type=text')
const shareLocation = document.querySelector('#share-location')
const FormButton = formId.querySelector('#send-message')
const messageContainer = document.querySelector('#message-container')

// templates
const $messsageTemplates = document.querySelector('#message-scripter').innerHTML
const $locationTemplate = document.querySelector('#location-scripter').innerHTML

// listening to all messages
socket.on('message', (message)=> {
    console.log(message)
    const html = Mustache.render($messsageTemplates, {
        message
    })
    messageContainer.insertAdjacentHTML('beforeend', html)

})

// listening to all shared location

socket.on('location', (location)=> {
    console.log(`you can find me here: https://www.google.com/maps?q=${location[0]},${location[1]}`)
    const url = `https://www.google.com/maps?q=${location[0]},${location[1]}`
    const html = Mustache.render($locationTemplate, {
        url
    })
    messageContainer.insertAdjacentHTML('beforeend', html)
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