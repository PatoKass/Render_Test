const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('person', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.person(req, res),
    ].join(' ')
  })
)

let entries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.use(express.json())

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  entries = entries.filter((person) => person.id !== id)

  if (!id) {
    response.status(404).end()
  }
  response.status(204).end()
})

app.get('/api/persons', (req, res) => {
  res.json(entries)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const person = entries.find((person) => person.id === id)

  if (person) {
    res.json(person)
  } else {
    console.log('fail')
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  res.send(`<div>Phonebook has info for ${entries.length} people</div>
  <div>${new Date()} </div>`)
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const isAlreadyName = entries.some((person) => person.name === body.name)
  const isAlreadyNumber = entries.some(
    (person) => person.number === body.number
  )

  if (isAlreadyName || isAlreadyNumber) {
    return res.status(409).json({ error: 'Name or number already exists' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  entries = [...entries, person]

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
