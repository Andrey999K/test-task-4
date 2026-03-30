import express, { Response, Request } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { testConnection } from "./config/database";
import { logger } from "./utils/log";


const app = express()

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());

if (env.NODE_ENV === "development") app.use(morgan("dev"));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  await testConnection();
  logger.info(`Server listening on port ${port}`);
});