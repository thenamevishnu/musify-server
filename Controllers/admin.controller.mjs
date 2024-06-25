import { adminCollection } from "../Models/admin.model.mjs";
import { trackCollection } from "../Models/tracks.model.mjs"
import { userCollection } from "../Models/user.model.mjs"
import bcrypt from "../Utils/bcrypt.mjs";
import { deleteFromCloud } from "../Utils/cloudinary.mjs";
import jwt from "../Utils/jwt.mjs";

const login = async (req, res) => {
    try {
        const { username, password } = req.query
        const admin = await adminCollection.findOne({ username: username })
        if (!admin) return res.status(404).send({
            message: "Admin does not exist"
        })
        const isCorrectPass = await bcrypt.validatePasswordHash(password, admin.password)
        if (!isCorrectPass) return res.status(400).send({
            message: "Invalid admin login"
        })
        admin._doc.role = "admin"
        const token = jwt.createToken(admin)
        return res.status(200).send({
            message: "success",
            token: token
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

const getStat = async (req, res) => {
    try {
        const userInfo = await userCollection.aggregate([{
            $group: {
                _id: null,
                users: {
                    $count: {}
                },
                singers: {
                    $sum: {
                        $cond: [{
                            $eq: ["$account_type", "singer"]     
                        }, 1, 0]
                    }
                },
                listeners: {
                    $sum: {
                        $cond: [{
                            $eq: ["$account_type", "listener"]     
                        }, 1, 0]
                    }
                }
            }
        }])
        const trackInfo = await trackCollection.aggregate([{
            $group: {
                _id: null,
                tracks: {
                    $count: {}
                },
                approved: {
                    $sum: {
                        $cond: [{
                            $eq: ["$status", "live"]
                        }, 1, 0]
                    }
                },
                pending: {
                    $sum: {
                        $cond: [{
                            $eq: ["$status", "pending"]
                        }, 1, 0]
                    }
                }
            }
        }])
        return res.status(200).send({
            message: "success",
            user_info: userInfo,
            track_info: trackInfo
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

const usersList = async (req, res) => {
    try {
        const users = await userCollection.find()
        if (Array.isArray(users)) {
            return res.status(200).send({
                message: "success",
                users: users
            })
        }
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

const blockOrUnblock = async (req, res) => {
    try {
        const {userid} = req.body
        const response = await userCollection.updateOne({_id: userid},[{$set: {blocked: {$cond: {if: "$blocked", then: false, else: true}}}}])
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({
                message: "success"
            })
        }
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

const tracksList = async (req, res) => {
    try {
        const tracks = await trackCollection.aggregate([{
            $lookup: {
                from: "users",
                localField: "added",
                foreignField: "_id",
                as: "singer"
            }
        }])
        if (Array.isArray(tracks)) {
            return res.status(200).send({
                message: "success",
                tracks: tracks
            })
        }
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

const deleteTrack = async (req, res) => {
    try {
        const { user_id, track_id } = req.params
        const getFile = await trackCollection.findOneAndDelete({ added: user_id, _id: track_id })
        console.log(user_id, track_id);
        const isDeletedFromCloud = await deleteFromCloud(getFile.track)
        if (!isDeletedFromCloud) {
            return res.status(500).send({
                deleted: false,
                message: "Something error happend!"
            })
        }
        return res.status(200).send({
            deleted: true,
            message: "success"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

const trackRequests = async (req, res) => {
    try {
        const tracks = await trackCollection.aggregate([{
            $lookup: {
                from: "users",
                localField: "added",
                foreignField: "_id",
                as: "singer"
            }
        }])
        if (Array.isArray(tracks)) {
            return res.status(200).send({
                message: "success",
                tracks: tracks
            })
        }
        return res.status(400).send({
            message: "Bad Request"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

const trackApprove = async (req, res) => {
    try {
        const { track_id } = req.body
        const response = await trackCollection.updateOne({ _id: track_id }, [{
            $set: {
                status: {
                    $cond: {
                        if: {
                            $eq: ["$status", "pending"]
                        },
                        then: "live",
                        else: "pending"
            }
                }
            }
        }])
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({ message: "success", updated: true })
        }
        return res.status(400).send({message: "Bad Request"})
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

const reports = async (req, res) => {
    try {
        const report = await trackCollection.aggregate([{
            $lookup: {
                from: "users",
                localField: "added",
                foreignField: "_id",
                as: "singer"
            }
        }])
        return res.status(200).send({
            message: "success",
            report: report
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).message({
            message: "Internal server error"
        })
    }
}

export default {
    getStat,
    login,
    usersList,
    blockOrUnblock,
    tracksList,
    deleteTrack,
    trackRequests,
    trackApprove,
    reports
}