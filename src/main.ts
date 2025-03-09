import http from "node:http"

const data: Array<{value: string, label: string, disabled?: boolean}> = [
    {
        label: "Морковь",
        value: "carrot",
        disabled: true
    }
]

class Server {
    constructor(port: number){
        this.createServer(port)
    }

    private createServer(port: number){
        http.createServer((req, res) => {

            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")

            this.router(req, res)
        }).listen(port, () => {
            console.log("server is done!")
        })
    }

    private router(
        req: http.IncomingMessage, 
        res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }
    ){
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

    private routeNotFound(
        req: http.IncomingMessage, 
        res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }
    ){
        res.statusCode = 404
        res.end()
    }

    private routeRoot(
        req: http.IncomingMessage, 
        res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }
    ){
        res.end("It is root")
    }

    private routeGetVegetables(
        req: http.IncomingMessage, 
        res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }
    ){
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
    }

    private routeCreateVegetables(
        req: http.IncomingMessage, 
        res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }
    ){
        if(req.method === 'POST'){

            this.getBody(req).then((bodyObj) => {
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
                    res.statusCode = 201
                    res.end("this is POST")
                }
            }).catch((error) => {
                res.statusCode = 502
                res.end("Some server error")
            })
        }
        else {
            this.routeNotFound(req, res)
        }
    }

    private getBody(req: http.IncomingMessage): Promise<{value: string, label: string, disabled?: boolean}>{
        return new Promise((resolve, reject) => {
            const body: any[] = []
            req.on("data", (chunk) => {body.push(chunk)})
            req.on("end", () => {
                const bodyStr = Buffer.concat(body).toString()
                const bodyObj = JSON.parse(bodyStr)
                resolve(bodyObj)
            })
            req.on("error", (error) => {
                reject(error)
            })
        })
    }
}

const server = new Server(3434)

for(let i = 0; i < 10; i++){
    const promise = new Promise((resolve, reject) => {
        const ms = Math.round(Math.random() * 4000 + 1000)

        setTimeout(
            () => {
                if(ms % 2 === 0){
                    resolve(`${i} - ${ms}`)
                }
                else {
                    reject(`${i} - ${ms}`)
                }
            },
            ms
        )
    })
    
    promise.then((res) => {
        console.log("successful -", res)
    }).catch((res) => {
        console.log("error -", res)
    })
}
