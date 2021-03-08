const generateMessage = (text)=> {
   return { 
        text,
        createsAt: new Date().getTime()
   }
}

module.exports = {
    generateMessage
}