const mongoose = require('mongoose')

const connectMongoDB = async () =>{

    try{
         const dbConn = await mongoose.connect(process.env.MONGO_DB)
        console.log(`MongoDB Connected to ${dbConn.connection.host}`.magenta.underline)
    } catch(error){
          console.log(error)
          process.exit(1)
    }
}

module.exports = connectMongoDB
