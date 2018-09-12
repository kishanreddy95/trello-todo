const express = require('express');

const app = express();

// app.get('/', (req, res) => res.send('hello world'));

const obj = {
  data: {
    name: 'kishan',
    age: 23,
  },
};


app.get('/name', (req, res) => {
  req.params = obj.data;
  res.json(req.params);
});

app.listen(3000, () => console.log('listening on port 3000'));
