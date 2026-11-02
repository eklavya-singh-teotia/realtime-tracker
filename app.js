import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from "url"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static(path.join(__dirname, "public")))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

io.on("connection", function(socket) {
    console.log("connected:", socket.id)

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data })
    })

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id)
    })
})

httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

export { app }
