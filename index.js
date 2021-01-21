const express = require("express")
var morgan = require("morgan")
const app = express()
const cors = require('cors')

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada LoveLace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  }
]

app.get("/", (request, response) => {
  // Respond with a following header
  response.send("<h1>Part 3 of Full Stack Open</h1>")
})

app.get('/api/persons', (request, response) => {
  // Respond with a following jsons to browser
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response
    .send(`Phonebook has info for ${persons.length} people.</br>${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  // Respond with the found persons if it exists
  if (person) {
    response.json(person)
  } else {
    // Person is 404
    response.status(404).end()
  }
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
  
  const person = {
    number: body.number,
    name: body.name,
    id: Math.floor(Math.random() * Math.floor(999999))
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})