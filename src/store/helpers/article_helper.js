export default class Article {
  constructor (
    id,
    title,
    abstract,
    description,
    author,
    cover,
    tags,
    date,
    likes,
    wordsCount,
    comments
  ) {
    this.id = id
    this.title = title
    this.abstract = abstract
    this.description = description
    this.author = author
    this.cover = cover
    this.tags = tags
    this.date = date
    this.likes = likes
    this.wordsCount = wordsCount
    this.comments = comments
  }
}
