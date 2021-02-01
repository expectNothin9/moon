export const arr2obj = (array) => {
  return array.reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

// https://stackoverflow.com/questions/9719434/picking-2-random-elements-from-array
export const shuffle = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
