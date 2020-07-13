const express = require('express')
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid');

const Backend = express()
  .use(express.json())
  .use(morgan('tiny'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "8c45ce1f-a5eb-405c-be1b-05efcae23b25"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "cf640a40-8210-4abe-985c-08b72c6897ab"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "ab3e78a0-72ee-4ff4-a4ce-69d48a51c04d"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "fc4bb2bd-064b-451d-a5de-4f9829c25377"
  }
]

Backend.get('/api/persons', (req, res) => {
  res.json(persons)
})

Backend.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

Backend.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: `${body.name} is already in the phonebook`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: uuidv4(),
  }

  persons = persons.concat(person)

  response.json(person)
})

Backend.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== request.params.id)
  response.status(204).end()
})

Backend.get('/info', (req, res) => {
  res.send(`<html><head><title>Phonebook</title></head><body><p>This phonebook contains ${persons.length} people.</p><p>${Date()}</p></body></html>`)
})

const PORT = 3001
Backend.listen(PORT, () => {
  console.log(`Phonebook backend running on port ${PORT}`)
})
