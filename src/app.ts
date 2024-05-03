import { MongoDB } from "./data/mongo/init";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import "dotenv/config";

(async () => {
  Main();
})();

async function Main() {
  const server = new Server({
    PORT: Number(process.env.PORT),
    routes: AppRoutes.routes,
  });

  await server.start();
  MongoDB.connection();
}
