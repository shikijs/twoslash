// twoslash: { theme: "dark-plus" }
// codefence: {1}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`)
}

greet("Maddison", new Date())
