const express = require('express');
const app = express();

// app.get('/', (req, res) => res.send('hello world'));

let obj = {
    data: {
        name: "kishan",
        age: 23
    }
}
app.post('/', function (req, res) {
    
})

app.listen(3000, () => console.log('listening on port 3000'));