// require the express npm module, needs to be added to the project using "yarn add" or "npm install"
const express = require('express');
const users = require('./data/db.js');

// creates an express application using the express module
const server = express();
server.use(express.json());

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get('/', (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  res.send('Hello World');
});

// HOBBITS ROUTES
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

server.post('/hobbits', (req, res) => {
  const hobbit = req.body;
  let nextId = 3;
  hobbit.id = nextId++;

  hobbits.push(hobbit)

  res.status(201).json(hobbits);
}) // 201 means created

server.get('/hobbits', (req, res) => {
  const sortField = req.query.sortby || 'id';

  const response = hobbits.sort(
    (a, b) => (a[sortField] < b[sortField] ? -1 : 1)
  );
  
  res.status(200).json(response);
});

server.put('/hobbits/:id', (req, res) => {
  const hobbit = hobbits.find(hobbit => hobbit.id == req.params.id);
  if (!hobbit) {
    res.status(404).json({ message: 'Hobbit does not exist' });
  } else {
    Object.assign(hobbit, req.body);
    res.status(200).json(hobbit);
  };
});

// server.delete('/hobbits/:id', (req, res) => {
//   const id = req.params.id;
//   res.status(200).json({
//       url: `/hobbits/${id}`,
//       operation: `DELETE for hobbit with id ${id}`
//     });
//     // res.redirect('/hobbits');
// });

server.delete('/hobbits/:id', (req, res) => {
  const id = req.params.id;
  // or we could destructure it like so: const { id } = req.params;

  const hobbit = hobbits.find(hobbit => hobbit.id === parseInt(req.params.id));
  if (!hobbit) return res.status(404).send('The hobbit to be deleted was not found.');

  const index = hobbits.indexOf(hobbit)
  hobbits.splice(index, 1);

  res.status(200).json({
    url: `/hobbits/${id}`,
    operation: `DELETE for hobbit with id ${id}`,
  });
});

// USERS ROUTES
server.get('/users', (req, res) => {
  users.find()
    .then(users => {
      console.log('\n** users**', users);
      res.status(200).json(users);
    })
    .catch(err => console.log(err));
});

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
const port = 8000;
server.listen(port, () => console.log(`=== API running on port ${port} ===`));