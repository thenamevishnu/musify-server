import { trackCollection } from "../Models/tracks.model.mjs"

const uploadTrack = async (req, res) => {
    try {
        const body = req.body
        for (let key in body) {
            if (!body[key]) return res.status(400).send({
                message: "Bad Request"
            })
        }
        const result = await trackCollection.create(body)
        if (result?._id) return res.status(201).send({
            message: "Track added", track: result
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

const getTrending = async (req, res) => {
    try {
        const tracks = await trackCollection.aggregate([
            {
                $addFields: {
                    playsCount: { $size: "$plays" }
                }
            },{
                $sort: {
                    playsCount: -1
                }
            }, {
                $limit: 10
            }
        ])
        if (!Array.isArray(tracks)) return res.status(400).send({
            message: "Bad Request"
        })
        return res.status(200).send({
            message: "success", 
            trendings: tracks
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

const getRecommendations = async (req, res) => {
    try {
        const { tags } = req.query
        const tagList = tags.split(",")
        const regexArray = tagList.map(word => ({ tags: { $regex: `^${word}$`, $options: "i" } }))
        const tracks = await trackCollection.find({ $or: regexArray}).limit(20)
        if (!Array.isArray(tracks)) return res.status(400).send({
            message: "Bad Request"
        })
        return res.status(200).send({
            message: "success", 
            recommended: tracks
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

const getTrack = async (req, res) => {
    try {
        const { trackId, user_id } = req.params
        const track = await trackCollection.findOne({ _id: trackId })
        await trackCollection.updateOne({ _id: trackId }, { $addToSet: { plays: user_id } })
        const previousTrack = await trackCollection.findOne({ _id: { $lt: trackId } }).sort({ _id: -1 })
        const nextTrack = await trackCollection.findOne({ _id: { $gt: trackId } }).sort({ _id: 1 })
        track._doc.previousTrack = previousTrack
        if (!previousTrack) {
            track._doc.previousTrack = await trackCollection.findOne({}).sort({_id: -1})
        }
        track._doc.nextTrack = nextTrack
        if (!nextTrack) {
            track._doc.nextTrack = await trackCollection.findOne({}).sort({_id: 1})
        }
        if (!track) return res.status(400).send({
            message: "Bad Request"
        })
        return res.status(200).send({
            message: "success", 
            track: track
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default {
    uploadTrack,
    getTrending,
    getRecommendations,
    getTrack
}