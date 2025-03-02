const http = require("http")

class Server {
    constructor(port){
        // this.port = port

        this.createServer(port)
    }

    createServer(port){
        http.createServer((req, res) => {

            this.router(req, res)

        }).listen(port, () => {
            console.log("server is done!")
        })
    }

    router(req, res){
        switch(req.url){
            case "/":
                this.routeRoot(req, res)
                break
            case "/vegetables":
                this.routeGetVegetables(req, res)
                break
            case "/vegetables/create":
                this.routeCreateVegetables(req, res)
                break
            default:
                this.routeNotFound(req, res)
        }
    }

    routeNotFound(req, res){
        res.statusCode = 404
        res.end()
    }

    routeRoot(req, res){
        res.end("It is root")
    }

    routeGetVegetables(req, res){
        const data = [
            {
                label: "Морковь",
                value: "carrot",
                disabled: true
            }
        ]

        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
    }

    routeCreateVegetables(req, res){
        if(req.method === 'POST'){

            const body = []

            req.on("data", (chunk) => {body.push(chunk)})

            req.on("end", () => {

                const bodyStr = Buffer.concat(body).toString()
                const bodyObj = JSON.parse(bodyStr)

                const data = [{}]

                let isFound = false
                for(let i = 0; i < data.length && !isFound; i++){
                    if(data[i].value === bodyObj.value){
                        isFound = true
                    }
                }
                if(isFound){
                    res.statusCode = 422
                    res.end("This element is exist")
                }
                else {
                    data.push(bodyObj)
                    res.end("this is POST")
                }

                // console.log(bodyStr)
                // console.log(bodyObj)

                
            })
        }
        else {
            this.routeNotFound(req, res)
        }
    }
}

const server = new Server(3434)