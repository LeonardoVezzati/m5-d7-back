import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { table } from "console";
import filesRouter from "./files/index.js";
import productsRouter from "./products/index.js";
import reviewsRouter from "./reviews/index.js";
import { errorHandler } from "./errorHandlers.js";

const server = express();
const port = 3001;

const publicFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public"
);

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/product", filesRouter);
server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

// error handlers +++++++++++
server.use(errorHandler);

table(listEndpoints(server));
server.listen(port, () => console.log(`Server is listening on: ${port}`));
