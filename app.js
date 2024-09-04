import http from "http"

const server = http.createServer()

server.on("request", (req, res) => {
    res.setHeader("Content-Type", "application/json")
})



server.listen(3000, () => {
    console.log("server listening on port 3000")
})