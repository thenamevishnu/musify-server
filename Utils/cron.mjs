import cronTask from "node-cron"
import axios from "axios"

cronTask.schedule("* * * * *", async () => {
    axios.get(`${process.env.SERVER}/api/status`).then(({data: res}) => {
        console.log(res)
    }).catch(err => {
        console.log(err.message);
    })
})