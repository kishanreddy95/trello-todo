const express = require('express');
const path = require('path');

const app = express();

// app.get('/', (req, res) => res.send('hello world'));

const obj = {
  data: {
    name: 'kishan',
    age: 23,
  },
};

app.use(express.static('public'));
app.use(express.json());

app.get('/obj', (req, res) => {
  console.log('here');
  res.send(obj);
});
app.post('/obj', (req, res) => {
  let abc =req.body;
  console.log(abc);
  let xyz =req.body;
  res.send(xyz);
});

app.listen(3000, () => console.log('listening on port 3000'));
