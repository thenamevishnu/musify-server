import { trackCollection } from "../Models/tracks.model.mjs"

const uploadTrack = async (req, res) => {
    try {
        const body = req.body
        for (let key in body) {
            if (!body[key]) return res.status(400).send({
                message: "Bad Request"
            })
        }
        const res = await trackCollection.create(body)
        if (res?._id) return res.status(201).send({
            message: "Track added", track: res
        })
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default {
    uploadTrack
}