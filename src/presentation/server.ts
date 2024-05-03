import express, { Router } from "express";

interface ServerOptions {
  PORT: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly PORT: number;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    const { PORT, routes } = options;

    this.routes = routes;
    this.PORT = PORT;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes);

    this.app.get("/", (req, res) => {
      res.send(`Server running in PORT ${this.PORT}`);
    });

    this.app.listen(this.PORT, () => {
      console.log(`Server running in PORT ${this.PORT}`);
    });
  }
}
