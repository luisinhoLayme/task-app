import { envs } from "./config"
import { MongoDatabase } from "./data/mongo"
import { AppRouter } from "./presentation/routes"
import { Server } from "./presentation/server"

const main = async () => {

  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME
  })

  const server = new Server({
    port: envs.PORT ?? 5000,
    routes: AppRouter.routes
  })

  server.start()
}

(async() => {
  main()
})()
