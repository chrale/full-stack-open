const http = require('http')
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
//createServer method of the http module to create a new web server

//event handler is registered to the server that is called every time an 
//HTTP request is made to the server's address http://localhost:3001.
// http.createServer([options][, requestListener])

//The request is responded to with the status code 200, with the 
//Content-Type header set to text/plain, and the content of the site 
//to be returned set to Hello World // json stingify!
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
// response.end() method expects a string or a buffer to send as the response body


//last rows bind the http server assigned to the app variable, 
//to listen to HTTP requests sent to port 3001
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)