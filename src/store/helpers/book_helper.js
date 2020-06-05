export default class Book {
  constructor (
    id,
    title,
    author,
    year,
    description,
    image,
    level,
    genres,
    parts
  ) {
    this.id = id
    this.title = title
    this.author = author
    this.year = year
    this.description = description
    this.image = image
    this.level = level
    this.genres = genres
    this.parts = parts
  }
}
