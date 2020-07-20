require('dotenv-expand')(require('dotenv').config())

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid');

const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204
const HTTP_BAD_REQUEST = 400
const HTTP_SERVER_ERROR = 500

const Person = require('./models/person')

morgan.token('body', request => {
  const body = JSON.stringify(request.body)
  return body === '{}' ? null : body
})

const Backend = express()
  .use(express.json())
  .use(express.static('build'))
  .use(cors())
  .use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

function returnError(err, code=HTTP_SERVER_ERROR) {
  console.log(err)
  response
    .status(code)
    .json({ error: err })
}

Backend.get('/api/persons', (_, response) => {
  Person
    .find({})
    .then(people => response.json(people))
})

Backend.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(note => response.json(note))
})

Backend.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number)) {
    returnError('name and/or number missing', HTTP_BAD_REQUEST)
  }

  Person
    .findOne({ 'name': body.name })
    .then(result => {
      if (result) {
        returnError(`${body.name} is already in the phonebook`, HTTP_BAD_REQUEST)
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
    .catch(error => returnError(error))
})

Backend.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(_ => response.status(HTTP_NO_CONTENT).end())
    .catch(error => returnError(error))
})

Backend.get('/info', (_, res) => {
  Person
    .countDocuments({})
    .then(numEntries => {
      res.send(`<html><head><title>Phonebook</title></head><body><p>This phonebook contains ${numEntries} people.</p><p>${Date()}</p></body></html>`)
    })
})

const PORT = process.env.PORT
Backend.listen(PORT, () => {
  console.log(`phonebook backend running on port ${PORT}`)
})
