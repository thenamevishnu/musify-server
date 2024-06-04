import { hash as createHash, compare as compareHash } from "bcrypt"

const createPasswordHash = async (password) => {
    const saltRound = 10
    const hash = await createHash(password, saltRound)
    return hash
}

const validatePasswordHash = async (password, hash) => {
    const res = await compareHash(password, hash)
    return res
}

export default {
    createPasswordHash, 
    validatePasswordHash
}