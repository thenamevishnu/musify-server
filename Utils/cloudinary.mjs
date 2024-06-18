import cloudinary from "cloudinary"

const v2 = cloudinary.v2

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_APIKEY_SECRET,
})

export const deleteFromCloud = async (fileUrl) => {
    const pub = fileUrl.split("/")
    const fileName = pub[pub.length - 1]
    const uid = fileName.split(".")[0]
    const res = await v2.api.delete_resources([`Tracks/${uid}`], {
        resource_type: "video",
        type: "upload"
    })
    if (res.deleted && res.deleted[`Tracks/${uid}`] == "deleted") {
        return true
    }
    return false
}