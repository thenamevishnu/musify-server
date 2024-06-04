import { userCollection } from "../Models/user.model.mjs"
import bcrypt from "../Utils/bcrypt.mjs"
import jwt from "../Utils/jwt.mjs"

const signup = async (req, res) => {
    try {
        const body = req.body
        console.log(body);
        for (let key in body) {
            if (!body[key]) return res.status(400).send({
                message: "Bad Request"
            })
        }
        const checkUsername = await userCollection.findOne({ username: body.username })
        if(checkUsername) return res.status(409).send({
            message: "Username already exist"
        })
        const checkEmail = await userCollection.findOne({ email: body.email })
        if(checkEmail) return res.status(409).send({
            message: "Email already exist"
        })
        body.password = await bcrypt.createPasswordHash(body.password)
        const response = await userCollection.create(body)
        response.password = null
        const token = jwt.createToken(response)
        return res.status(201).send({
            message: "Account Created", token: token
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "internal server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password} = req.query
        if (!username || !password) return res.status(400).send({
            message: "Bad Request"
        })
        const user = await userCollection.findOne({
            username: username
        })
        if (!user) return res.status(404).send({
            message: "User doesn't exist"
        })
        const valid = await bcrypt.validatePasswordHash(password, user.password)
        if(!valid) return res.status(400).send({
            message: "Invalid Login"
        })
        user.password = null
        const token = jwt.createToken(user)
        return res.status(200).send({
            message: "Loggin success", token: token
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "internal server error"
        })
    }
}

export default {
    signup,
    login
}