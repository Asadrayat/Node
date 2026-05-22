import { log } from "console";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { url } from "inspector";
import { json } from "stream/consumers";
import { routeHandlers } from "./route";
import config from "../config";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    routeHandlers(req, res);
})

server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
})