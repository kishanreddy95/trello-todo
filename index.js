const express = require('express');
const path = require('path');

const app = express();

// app.get('/', (req, res) => res.send('hello world'));

const obj = {
  data1: {
    name: 'kishan',
    age: 23,
  },
};

app.use(express.static('public'));
app.use(express.json());

// app.get('/obj', (req, res) => {
//   console.log('here');
//   res.send(obj);
// });
// app.post('/obj', (req, res) => {
//   let abc =req.body;
//   console.log(abc);
//   let xyz =req.body;
//   res.send(xyz);
// });

app.get('/lists', (req, res) => {
  res.send(obj);
});

app.post('/lists', (req, res) => {
  obj.data2 = req.body;
  console.log(req.body);
  res.send(obj.data2);
});

// app.get('/lists')

app.listen(3000, () => console.log('listening on port 3000'));
