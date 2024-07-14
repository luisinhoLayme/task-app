import { Request, Response } from "express";
import { CreateTaskDto, HandleError, PaginationDto, SearchTaskDto, UpdateTaskDto } from "../../domain";
import { TaskService } from "../services/task.service";


export class TaskController {

  constructor(
    public readonly taskService: TaskService
  ) {}

  public getTasks = (req:Request, res:Response) => {
    const { page = 1, limit = 6 } = req.query
    const [ error, paginationDto ] = PaginationDto.create(+page, +limit)
    if ( error ) return res.status(400).json({ error })

    this.taskService.getTasks( req.body.user.id, paginationDto! )
      .then( tasks => res.json( tasks ) )
      .catch( error => HandleError.error( error, res ))
  }

  public getTaskByTitle = (req:Request, res:Response) => {
    const title = req.query.q
    const [ error, searchTaskDto ] = SearchTaskDto.create({ title })
    if ( error ) return res.status(400).json({ error })

    this.taskService.getTaskByTitle(searchTaskDto!, req.body.user.id )
      .then( task => res.json( task ) )
      .catch( error => HandleError.error( error, res ) )
  }

  public createTask = (req:Request, res:Response) => {
    const [ error, createTaskDto ] = CreateTaskDto.create(req.body)
    if ( error ) return res.status(400).json({ error })

    this.taskService.createTask(createTaskDto!, req.body.user.id)
      .then( task => res.status(201).json(task) )
      .catch( error => HandleError.error( error, res ))

  }

  public updateTask = (req:Request, res:Response) => {
    const id = req.params.id
    const [ error, updateTaskDto ] = UpdateTaskDto.create({ ...req.body, id })
    if ( error ) return res.status(400).json({ error })

    this.taskService.updateTask(updateTaskDto!, req.body.user.id )
      .then( task => res.json( task ) )
      .catch( error => HandleError.error( error, res ) )
  }

  public updateTaskCompleted = (req:Request, res:Response) => {
    const id = req.params.id

    this.taskService.updateTaskCompleted( id, req.body.user.id )
      .then( task => res.json( task ) )
      .catch( error => HandleError.error( error, res ) )
  }

  public deleteTask = async (req:Request, res:Response) => {
    const id = req.params.id;

    this.taskService.deleteTask(id, req.body.user.id)
      .then( () => res.json({ ok: 'task deleted success' }) )
      .catch( error => HandleError.error( error, res ) )
  }
}
