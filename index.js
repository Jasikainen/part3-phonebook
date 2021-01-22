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
  response.send("<h1>Part 3 of Full Stack Open</h1>")
})


app.get('/api/persons', (request, response) => {
  // Respond with found persons to browser
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (request, response) => {
  const date = new Date()
  response
    .send(`Phonebook has info for ${persons.length} people.</br>${date}`)
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.number || !body.name) {
    return response.status(400).json({ 
      error: 'body or number missing' 
    })
  }


  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase() !== body.name.toLowerCase())
  if (filteredPersons.length < persons.length) {
    return response.status(400).json({ 
      error: `Name ${body.name} already found!`
    })
  }
  
  const person = new Person({
    number: body.number,
    name: body.name
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})