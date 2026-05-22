import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "./controller/product.controller";

export const routeHandlers = (req: IncomingMessage, res: ServerResponse) => {
    if (req?.url == '/' && req?.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "This the root Route" }))
    } else if (req.url?.startsWith("/products")) {
            productController(req,res);
    }
    else {
        res.writeHead(404, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Route Not found" }))
    }
}