import http from "http"
import url, { fileURLToPath } from "url"
import fs from "fs/promises"
import path, { dirname } from "path"
import crypto from "crypto"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonPath = path.resolve(__dirname, "todos.json")

const server = http.createServer()

server.on("request", async (req, res) => {

    res.setHeader("Content-Type", "application/json")

    const reqUrl = req.url
    const method = req.method
    const parsedUrl = url.parse(req.url)


    // get todo by id
    if (parsedUrl.pathname === "/api/todo") {
        // extract id
        const id = parsedUrl.query.split("=")[1]
        try {
            // readfile 
            const jsonData = JSON.parse(await fs.readFile(jsonPath, "utf-8"))

            // check if data exist 
            const todoIndex = jsonData.findIndex(todo => todo.id === id)
            if (todoIndex === -1) {
                res.writeHead(400, `todo with ${id} doesn't exist`);
                res.end()
            }
            res.writeHead(200, "Todo found successfull")
            res.end(JSON.stringify(jsonData[todoIndex]))

        }
        catch (error) {
            res.writeHead(400, "couldn't get todo")
            res.end()
        }

    }

    // create todo
    if (parsedUrl.pathname === "/api/todo/create" && method === "POST") {
        let body = []

        req.on("data", (chunk) => {
            console.log(typeof chunk)
            body.push(chunk)
        })

        req.on("end", async () => {
            try {
                const parsedBody = JSON.parse(Buffer.concat(body).toString())

                const uniqueId = crypto.randomUUID()
                parsedBody.id = uniqueId
                // read json
                const todoList = await fs.readFile(jsonPath, "utf-8")
                let parsedTodoList = JSON.parse(todoList)

                // writing in file
                parsedTodoList.push(parsedBody)
                await fs.writeFile(jsonPath, JSON.stringify(parsedTodoList))

                // send response
                res.writeHead(200, "Todo added successfully");
                res.end(JSON.stringify(parsedBody))
            }
            catch (error) {
                res.writeHead(500, "failed to create todo")
                res.end()
            }
        })
    }


    // get all todos
    if (reqUrl === "/api/todo/todos" && method === "GET") {
        console.log(path.resolve(__dirname, "todos.json"))
        // read from file
        const todos = await fs.readFile(jsonPath, "utf-8")
        res.end(todos)
    }

    // update todos
    if (parsedUrl.pathname === "/api/todo/update" && method === "PUT") {
        //extract id 
        const id = parsedUrl.query.split("=")[1]

        let body = []

        // read and parse data from req body
        req.on("data", (chunk) => {
            body.push(chunk)
        })

        req.on("end", async () => {

            // parse req body
            const parsedBody = JSON.parse(Buffer.concat(body).toString())

            // readfile
            const jsonData = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

            // find and update todo 
            const todo = jsonData.find(todo => todo.id = id)
            if (todo) {
                Object.assign(todo, parsedBody)
            }
            // write back to file
            await fs.writeFile(jsonPath, JSON.stringify(jsonData));

            res.writeHead(200, `todo with id ${id} updated successfylly`)
            res.end(JSON.stringify(todo))

        })
    }

    // delete todo by id
    if (parsedUrl.pathname === "/api/todo/delete" && method === "DELETE") {
        //extract id
        const id = parsedUrl.query.split("=")[1]

        try {

            // readfile 
            const jsonData = JSON.parse(await fs.readFile(jsonPath, "utf-8"))

            // check if data exist 
            const todoIndex = jsonData.findIndex(todo => todo.id === id)
            if (todoIndex === -1) {
                res.writeHead(400, `todo with ${id} doesn't exist`);
                res.end()
            }
            // filter and save = delete
            const filteredTodos = jsonData.filter(todo => todo.id !== id)
            await fs.writeFile(jsonPath, JSON.stringify(filteredTodos))

            // response
            res.writeHead(200, `todo with id ${id} deleted successfully`)
            res.end(JSON.stringify(jsonData[todoIndex]))

        } catch (error) {
            res.writeHead(400, "Failed to delete todo")
            res.end()
        }
    }
})



server.listen(3000, () => {
    console.log("server listening on port 3000")
})