export default class Thread {
  constructor (
    id,
    title,
    description,
    author,
    tags,
    date,
    topic,
    replies,
    answered
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.author = author
    this.tags = tags
    this.date = date
    this.topic = topic
    this.replies = replies
    this.answered = answered
  }
}
