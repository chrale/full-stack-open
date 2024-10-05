
//we're importing express, which this time is a function that is used to create an 
//Express application stored in the app variable:
const express = require('express')
const app = express()

app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// two routes to the application:
// event handler that is used to handle HTTP GET requests made to the application's / root
//first request parameter contains all of the information of the HTTP request, and 
//the second response parameter is used to define how the request is responded to.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//second route defines an event handler that handles HTTP GET requests made to the notes path of the application:
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
// json transformation happens automatically with express! no need to you stringify

//app.get('/api/notes/:id', ...) will handle all HTTP GET requests that are of 
//the form /api/notes/SOMETHING, where SOMETHING is an arbitrary string.
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

//event handler function can access the data from the body 
//property of the request object.
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
//Without the json-parser, the body property would be undefined.
// The json-parser takes the JSON data of a request, transforms it into a
// JavaScript object and then attaches it to the body property of the request 
//object before the route handler is called.


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
