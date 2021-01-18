const express = require("express")
const app = express()
app.use(express.json()) 

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
  console.log(request)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`) 
})