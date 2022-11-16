import express, { Express } from "express"
import path from "path";
const app = express()
const port = 9080;

const filepath = './image';
const picName = 'images.jpg';
app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, filepath, picName));
})

app.listen(port, () => {
    console.log("Example")
})