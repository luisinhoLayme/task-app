
export class UpdateTaskDto {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly completed: boolean,
    public readonly id: string
  ) {}

  get values() {

    const returnObj: {[ key: string]: any} = {}

    if ( this.title ) returnObj.title = this.title
    if ( this.description ) returnObj.description = this.description

    return returnObj
  }

  static create( object: {[ key: string ]: any}): [string?, UpdateTaskDto?] {
    const { title, description, completed = false, id } = object
    let completedBool = completed

    if ( !title ) return ['Missing title', undefined]
    if ( !description ) return ['Missing description', undefined]
    if ( typeof completedBool !== 'boolean' ) {
      completedBool = ( completed === 'true' )
    }

    return [undefined, new UpdateTaskDto(title, description, completedBool, id)]
  }
}
