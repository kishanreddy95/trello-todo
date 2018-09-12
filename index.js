const express = require('express');

const app = express();

// app.get('/', (req, res) => res.send('hello world'));

const obj = {
  data: {
    name: 'kishan',
    age: 23,
  },
};
app.post('/', (req, res) => {
  res.send(obj);
});

app.listen(3000, () => console.log('listening on port 3000'));
