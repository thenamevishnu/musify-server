import { connect } from "mongoose";

connect(process.env.MONGODB).then(res => {
    console.log(`connected DB: ${res.connection.db.databaseName}`)
}).catch(err => {
    console.log(err.message)
    return process.exit(1)
})