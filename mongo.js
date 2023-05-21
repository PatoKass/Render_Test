const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    'The correct uses of this program are: "node mongo.js <password>"(returns phonebook list) "node mongo.js <password> <name> <number>" (makes new entry)'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://patogeka:${password}@phonebook.oo3lydq.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then((result) => {
    console.log(
      `added ${person.name} number ${person.number} to the phonebook `
    )
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((persons) => {
    console.log(`phonebook:`)
    persons.forEach((person) => {
      console.log(`${person.name}  ${person.number}`)
    })
    mongoose.connection.close()
  })
}
