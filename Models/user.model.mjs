import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    picture: {type: String, default: ""},
    password: { type: String, required: true }
}, {
    timestamps: true
})

export const userCollection = model("users", userSchema)