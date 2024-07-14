
export class CreateTaskDto {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly completed: boolean
  ) {}

  static create( object: {[ key: string ]: any}): [string?, CreateTaskDto?] {

    const { title, description, completed = false } = object
    let completedBool = completed

    if ( !title ) return ['Missing title', undefined]
    if ( !description ) return ['Missing description', undefined]
    if ( typeof completedBool !== 'boolean' ) {
      completedBool = ( completed === 'true' )
    }

    return [undefined, new CreateTaskDto(title, description, completedBool)]
  }
}
