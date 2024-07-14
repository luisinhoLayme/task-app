export class SearchTaskDto {
  private constructor(
    public readonly title: string,
  ) {}

  static create( object: {[ key: string ]: any}): [string?, SearchTaskDto?] {

    const { title } = object

    if ( !title ) return ['Missing field', undefined]

    return [undefined, new SearchTaskDto(title)]
  }
}
