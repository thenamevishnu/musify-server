import { Schema, Types, model } from "mongoose";

const trackSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    track: { type: String, required: true },
    thumb: { type: String, required: true },
    tags: { type: Array, default: [], required: true },
    added: { type: Types.ObjectId, required: true },
    total_played: { type: Number, default: 0 }
}, {
    timestamps: true
})

export const trackCollection = model("tracks", trackSchema)