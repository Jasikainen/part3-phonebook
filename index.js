require('dotenv').config()
const express = require("express")
var morgan = require("morgan")
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', (req) => {
  if (req.method === "POST"){
    var myJSON = JSON.stringify(req.body)
    return `${myJSON}`
  } else {
    return " "
  }
})
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get("/", (request, response) => {
  // Respond with a following header
  response.send("<h1>Part 3 of Full Stack Open Back-End</h1>")
})


app.get('/api/persons', (request, response) => {
  // Respond with found persons to browser
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response
    .send(`Phonebook has info for ${persons.length} people.</br>${date}`)
  })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error =>{
      console.log("toimiiko", error)
      next(error)
    } )
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'body or number missing' 
    })
  }
  
  const person = new Person({
    number: body.number,
    name: body.name
  })
  person
    .save()
    .then(savedPerson => {
      return savedPerson.toJSON()
    })
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number,
    name: body.name,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => {
      next(error)})
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})