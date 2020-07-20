console.log('process.env.NODE_ENV', process.env.NODE_ENV)
require('dotenv-expand')(require('dotenv').config())

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND = 404
const HTTP_SERVER_ERROR = 500

const Person = require('./models/person')

morgan.token('body', request => {
  const body = JSON.stringify(request.body)
  return body === '{}' ? null : body
})

const Backend = express() 
  .use(express.static('build'))
  .use(express.json())
  .use(cors())
  .use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

function returnError(response, error, code=HTTP_SERVER_ERROR) {
  console.log(error)
  response
    .status(code)
    .json({ error: error })
}

Backend.get('/api/persons', (_, response) => {
  Person
    .find({})
    .then(people => response.json(people))
})

Backend.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(HTTP_NOT_FOUND).end()
      }
    })
    .catch(error => next(error))
})

Backend.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(HTTP_NOT_FOUND).end()
      }
    })
    .catch(error => next(error))
})

Backend.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!(body.name && body.number)) {
    returnError(response, 'name and/or number missing', HTTP_BAD_REQUEST)
  }

  Person
    .findOne({ 'name': body.name })
    .then(result => {
      if (result) {
        returnError(response, `${body.name} is already in the phonebook`, HTTP_BAD_REQUEST)
      } else {
        new Person({
          name: body.name,
          number: body.number,
        }).save()
          .then(savedPerson => response
            .status(HTTP_CREATED)
            .json(savedPerson))
      }
    })
    .catch(error => next(error))
})

Backend.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(_ => response.status(HTTP_NO_CONTENT).end())
    .catch(error => next(error))
})

Backend.get('/info', (_, res) => {
  Person
    .countDocuments({})
    .then(numEntries => {
      res.send(`<html><head><title>Phonebook</title></head><body><p>This phonebook contains ${numEntries} people.</p><p>${Date()}</p></body></html>`)
    })
})

Backend.use((_, response) => {
  response.status(HTTP_NOT_FOUND).send({ error: 'unknown endpoint' })
})

Backend.use((error, request, response, next) => {
  console.log('error', error)
  if (error.name === 'CastError') {
    return response
      .status(HTTP_BAD_REQUEST)
      .json({ error: `malformed id: ${error.value}` })
  } else if (error.name === 'ValidationError') {
    return response
      .status(HTTP_BAD_REQUEST)
      .json({ error: error.message })
  } else {
    return response
      .status(HTTP_SERVER_ERROR)
      .json({ error: `${error.name}: ${error.message}` })
  }
})

const PORT = process.env.PORT
Backend.listen(PORT, () => {
  console.log(`phonebook backend running on port ${PORT}`)
})
