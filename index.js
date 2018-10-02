// require the express npm module, needs to be added to the project using "yarn add" or "npm install"
const express = require('express');
const users = require('./data/db.js');

// creates an express application using the express module
const server = express();

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get('/', (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  res.send('Hello World');
});

// ROUTE /hobbits
server.get('/hobbits', (req, res) => {
  // route handler code here
  const hobbits = [
    {
      id: 1,
      name: 'Samwise Gamgee',
    },
    {
      id: 2,
      name: 'Frodo Baggins',
    },
  ];
  const sortField = req.query.sortby || 'id';
  
  const response = hobbits.sort(
    (a, b) => (a[sortField] < b[sortField] ? -1 : 1)
  );
  
  res.status(200).json(response);
});

server.post('/hobbits', (req, res) => {
  res.status(201).json({ url: '/hobbits', operation: 'POST' });
}) // 201 means created

server.put('/hobbits', (req, res) => {
  res.status(200).json({ url: '/hobbits', operation: 'PUT' });
}) // 200 means okay

server.delete('/hobbits/:id', (req, res) => {
  const { id } = req.params

  res.status(204)
    .json({
      url: `/hobbits/${id}`,
      operation: `DELETE for hobbit with id ${id}`
    });
    res.redirect('/hobbits')
}) // 204 means no content

// ROUTE /users
server.get('/users', (req, res) => {
  users.find()
    .then(users => {
      console.log('\n** users**', users);
      res.json(users);
    })
    .catch(err => console.log(err))
})

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
const port = 8000;
server.listen(port, () => console.log(`=== API running on port ${port} ===`));