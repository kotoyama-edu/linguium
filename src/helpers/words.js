export function setWords (array, userWords) {
  for (var prop in userWords) {
    if (userWords.hasOwnProperty(prop)) {
      let word = userWords[prop]
      let isAvailable = (word.nextShowDate instanceof Date)
        ? word.nextShowDate <= new Date()
        : word.nextShowDate.toDate() <= new Date()

      if (isAvailable) {
        array.push({
          id: prop,
          original: word.original,
          translation: word.translation
        })
      }
    }
  }
}

export const shuffle = (array) => {
  let counter = array.length
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter)
    counter--
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
  return array
}
