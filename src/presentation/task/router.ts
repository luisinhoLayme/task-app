import { Router } from "express";
import { TaskController } from "./controller";
import { TaskService } from "../services/task.service";
import { RoutesMiddleware } from "../middleware/routes.middleware";

export class TaskRoutes {

  static get routes(): Router {

    const router = Router()
    const taskService = new TaskService()
    const controller = new TaskController(taskService)

    router.use( RoutesMiddleware.validateJWT )

    router.get('/', controller.getTasks)
    router.get('/search', controller.getTaskByTitle)
    router.post('/', controller.createTask)
    router.put('/:id', controller.updateTask)
    router.patch('/:id', controller.updateTaskCompleted)
    router.delete('/:id', controller.deleteTask)

    return router
  }
}
