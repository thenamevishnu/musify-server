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
        if (!response._id) return res.status(400).send({
            message: "Bad Request"
        })
        response.password = null
        response._doc.role = "user"
        const token = jwt.createToken(response)
        console.log(token, response);
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
        user._doc.role = "user"
        console.log(user);
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

const getSingers = async (req, res) => {
    try {
        const users = await userCollection.find({ account_type: "singer" })
        if (!Array.isArray(users)) return res.status(400).send({
            message: "Bad Request"
        })
        return res.status(200).send({
            message: "success", 
            singers: users
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "internal server error"
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { user_id } = req.params
        const body = req.body
        const response = await userCollection.updateOne({ _id: user_id }, { $set: body })
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({
                message: "success"
            })
        }
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "internal server error"
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { user_id } = req.params
        const body = req.body
        const user = await userCollection.findOne({ _id: user_id })
        if (!user) {
            return res.status(404).send({
                message: "user does not exist"
            })
        }
        const currentPasswordCheck = await bcrypt.validatePasswordHash(body.currentPassword, user.password)
        if (!currentPasswordCheck) {
            return res.status(400).send({
                message: "Current password is incorrect"
            })
        }
        const newPasswordCheck = await bcrypt.validatePasswordHash(body.newPassword, user.password)
        if (newPasswordCheck) {
            return res.status(400).send({
                message: "New password same as current password"
            })
        }
        const hash = await bcrypt.createPasswordHash(body.newPassword)
        const response = await userCollection.updateOne({ _id: user_id }, { $set: { password: hash } })
        if (response.modifiedCount == 1 && response.matchedCount == 1) {
            return res.status(200).send({
                message: "success"
            })
        }
        return res.status(400).send({
            message: "Bad Request"
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
    login,
    getSingers,
    updateProfile,
    updatePassword
}