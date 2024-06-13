const status = async(req, res) => {
    try { 
        return res.status(200).send({
            message: "Server is up now!"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default {
    status
}