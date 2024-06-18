import jwt from "jsonwebtoken"

const createToken = (payload) => {
    const token = jwt.sign({sub: payload}, process.env.JWT_KEY, {
        expiresIn: "7d"
    })
    return token
}

const validateUserToken = (resToken) => {
    const now = Math.floor(new Date().getTime() / 1000)
    const token = jwt.verify(resToken, process.env.JWT_KEY)
    if (token.sub?.role != "user") {
        return false
    }
    return token.exp > now
}

const validateAdminToken = (resToken) => {
    const now = Math.floor(new Date().getTime() / 1000)
    const token = jwt.verify(resToken, process.env.JWT_KEY)
    if (token.sub?.role != "admin") {
        return false
    }
    return token.exp > now
}

export default {
    createToken,
    validateUserToken,
    validateAdminToken
}