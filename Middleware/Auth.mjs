import jwt from "../Utils/jwt.mjs"

export const Auth = async (req, res, next) => {
    try {
        const bearerToken = req.headers["authorization"]
        if (!bearerToken.includes(" ")) return res.status(401).send({
            message: "Bad Request"
        })
        const parts = bearerToken.split(" ")
        if(!parts[1]) return res.status(401).send({
            message: "Bad Request"
        })
        const response = jwt.validateToken(parts[1])
        if (response) return next()
        return res.status(401).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}