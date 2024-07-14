import mongoose from "mongoose"
import { TaskModel } from "../../data/mongo/models/task.model"
import { CreateTaskDto, CustomError, PaginationDto, SearchTaskDto, UpdateTaskDto } from "../../domain"

export class TaskService {

  public async getTasks(id: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto

    try {
      const [total, tasks] = await Promise.all([
        TaskModel.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(id)  } },
          {
            $project: {
              count: { $size: "$tasks" },
            }
          }
        ]),
        TaskModel.findOne({ user: id }, { tasks: { $slice: [(page - 1) * limit, limit] } })
        // .skip( (page - 1) * limit )
        // .limit( limit )
        // TaskModel.aggregate([
        //   {
        //     $project: {
        //       user: id,
        //       tasks: {
        //         $slice: [
        //           "$tasks",
        //           1,
        //           6
        //         ]
        //       },
        //       total: {
        //         $size: "$tasks"
        //       }
        //     }
        //   }
        // ])
      ])

      return {
        limit: limit,
        total: total.at(0).count,
        page: page,
        next: `/api/tasks?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/tasks?page=${(page - 1)}&limit=${limit}` : null,
        tasks: tasks!.tasks
      }
    } catch (err) {
      throw CustomError.internalServer(`Internal server errror ${err}`)
    }
    // return {
    //   results: userTask.tasks
    // }
  }

  public async getTaskByTitle(searchTaskDto: SearchTaskDto, id: string) {
    const regex = new RegExp(searchTaskDto.title, 'i')
    const userTask = await TaskModel.findOne({ user: id })
    if (!userTask) throw CustomError.badRequest('Task User not exists')

    const searchTask = userTask.tasks.filter(
      t => t.title.toLowerCase().includes(searchTaskDto.title.toLowerCase())
    )

    return {
      results: searchTask
    }
  }

  public async createTask(createTaskDto: CreateTaskDto, id: string) {
    const userTask = await TaskModel.findOne({ user: id })
    if (!userTask) throw CustomError.badRequest('Task User not exists')

    const existsTask = userTask.tasks.find(e => e.title === createTaskDto.title)
    if (existsTask) throw CustomError.badRequest('Task already exists')

    try {
      userTask.tasks.push(createTaskDto)

      await userTask.save()

      return {
        tasks: userTask.tasks
      }
    } catch (err) {
      throw CustomError.internalServer(`${err}`)
    }
  }

  public async updateTask(updateTaskDto: UpdateTaskDto, id: string) {
    if (!mongoose.Types.ObjectId.isValid(updateTaskDto.id)) throw CustomError.badRequest('Mongo id is not valid')

    const userTask = await TaskModel.findOne({ user: id })
    if (!userTask) throw CustomError.badRequest('Task User not exists')

    const taskIndex = userTask.tasks.findIndex(t => t.id === updateTaskDto.id)
    if (taskIndex === -1) throw CustomError.badRequest(`Task not exists with id ${updateTaskDto.id}`)

    try {
      // const updateTask = await TaskModel.findByIdAndUpdate(updateTaskDto.id, updateTaskDto.values, { new: true })

      const { title, description } = updateTaskDto.values

      let uTask = userTask.tasks.at(taskIndex)
      uTask!.title = title
      uTask!.description = description
      await userTask.save()

      return {
        updateTask: userTask.tasks.at(taskIndex),
      }
    } catch (err) {
      throw CustomError.internalServer(`${err}`)
    }
  }

  public async updateTaskCompleted(idTask: string, id: string) {
    if (!mongoose.Types.ObjectId.isValid(idTask)) throw CustomError.badRequest('Mongo id is not valid')

    const userTask = await TaskModel.findOne({ user: id })
    if (!userTask) throw CustomError.badRequest('Task User not exists')

    // const ta = await TaskModel.findOne({ user: id, "tasks._id": idTask }, { tasks: { $elemMatch: { _id: idTask } } })
    // console.log(ta)
    // if (!ta) throw CustomError.badRequest('task no exists xd nab')
    //
    const taskIndex = userTask.tasks.findIndex(t => t.id === idTask)
    if (taskIndex === -1) throw CustomError.badRequest(`Task not exists with id ${idTask}`)

    try {
      let uTask = userTask.tasks.at(taskIndex)
      uTask!.completed = (uTask!.completed) ? !uTask!.completed : !uTask!.completed
      await userTask.save()

      return {
        updateTask: userTask.tasks.at(taskIndex),
      }
    } catch (err) {
      throw CustomError.internalServer(`${err}`)
    }
  }

  public async deleteTask(idTask: string, id: string) {
    if (!mongoose.Types.ObjectId.isValid(idTask)) throw CustomError.badRequest('Mongo id is not valid')

    const userTask = await TaskModel.findOne({ user: id })
    if (!userTask) throw CustomError.badRequest(`Task user not exists`)

    const taskIndex = userTask.tasks.findIndex(t => t.id === idTask)
    if (taskIndex === -1) throw CustomError.badRequest(`Task not exists with id ${idTask}`)
    // const existsTask = await TaskModel.findOne(
    //   { "user": id, "tasks._id": idTask },
    //   { "tasks.$": true }
    // )
    // if (!existsTask) throw CustomError.badRequest(`Task not exists with id ${idTask} `)

    userTask.tasks.id(idTask)?.deleteOne()
    await userTask.save()

    // await TaskModel.findByIdAndDelete(id)
  }
}
