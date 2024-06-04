import jwt from "jsonwebtoken"

const createToken = (payload) => {
    const token = jwt.sign({sub: payload}, process.env.JWT_KEY, {
        expiresIn: "7d"
    })
    return token
}

const validateToken = (resToken) => {
    const now = Math.floor(new Date().getTime() / 1000)
    const token = jwt.verify(resToken, process.env.JWT_KEY)
    return token.exp > now
}

export default {
    createToken,
    validateToken
}