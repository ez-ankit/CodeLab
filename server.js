import { createServer } from "http";
import next from "next";
import { config } from "dotenv";
import { setupSocketIO } from "./src/lib/socket.js";

config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  setupSocketIO(server);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
