import "tsconfig-paths/register";
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  private setMiddlewares(): void {
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://20.189.249.102:3000",
        ],
        credentials: true,
      }),
    );
    this.app.use(morgan("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use("/api/health", (_, res) => {
      res.json({ status: "ok" });
    });
  }

  private setRoutes(): void {
    const routesPath = path.join(__dirname, "routes");
    const isTs = __filename.endsWith(".ts");
    const extension = isTs ? ".ts" : ".js";

    fs.readdirSync(routesPath).forEach((file) => {
      if (file.endsWith(extension)) {
        const routeModulePath = path.join(routesPath, file);
        const route = require(routeModulePath).default;

        if (route) {
          const routeName = file.replace(/\.route\.(ts|js)$/, "");
          this.app.use(`/api/${routeName}`, route);
        }
      }
    });
  }

  public async listen(port: number): Promise<void> {
    try {
      await connectDB();
      this.app.listen(port, () => {
        logger.info(`🚀 Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      logger.error("❌ Failed to start server:", error);
    }
  }
}

export default App;
