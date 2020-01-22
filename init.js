function initDB(){
    const dbUser = 'user'
    const dbPass = 'user123'
    const dbName = 'test'

    return  {
        USER : dbUser,
        PASSWORD : dbPass,
        URL : `mongodb+srv://${dbUser}:${dbPass}@cluster0-hfbmi.mongodb.net/${dbName}?retryWrites=true&w=majority`
    }
}

module.exports = () => {
    global.SERVER_PORT = 9999

    global.DB = initDB()
    require('./connection').connectDB()
}