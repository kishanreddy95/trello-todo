const express = require('express');
const sqlite = require('sqlite');
const Promise = require('bluebird');
const dataBaseFunctions = require('./db.js');

const db = sqlite.open('./trello.sqlite', { Promise });
const app = express();

app.use(express.static('public'));
app.use(express.json());

// All Lists available
app.get('/lists', (req, res) => {
});

app.post('/lists', (req, res) => {
  db.then((data) => {
    dataBaseFunctions.createTable(data);
    return data;
  }).then((data) => {
    const { id } = req.body;
    const { name } = req.body;
    console.log(req.body);
    dataBaseFunctions.insertTableLists(data, id, name);
    res.send('done');
  });
});

// Getting or deleting a particular List

app.get('/lists/:listId', (req, res) => {
  db.then(data => dataBaseFunctions.selectTableLists(data, req.params.listId))
    .then((resp) => {
      res.send(resp);
    });
});

app.delete('/lists/:listId', (req, res) => {
  db.then(data => dataBaseFunctions.deleteTableLists(data, req.params.listId));
  res.send('done');
});

// Getting and Creating list items

app.get('/list/:listId/items', (req, res) => {
  // const listItems = ListItems.filter((item) => {
  //   if (parseInt(req.params.listId) === item.listId) {
  //     return item;
  //   }
  // });
  // res.send(listItems);
});

app.post('/list/:listId/items', (req, res) => {
  // const item = {
  //   listId: parseInt(req.params.listId),
  //   id: req.body.id,
  //   content: req.body.content,
  //   status: 'false',
  // };
  // ListItems.push(item);
  // res.send(item);
  db.then((data) => {
    dataBaseFunctions.createTableItems(data);
    return data;
  }).then((data) => {
    
  })
});


// Getting, Updating and Deleting individual list items

app.get('/list/:listId/items/:itemId', (req, res) => {
  const listItem = ListItems.filter((item) => {
    if (item.listId === parseInt(req.params.listId) && item.id === parseInt(req.params.itemId)) {
      return item;
    }
  });
  res.send(listItem);
});

app.post('/list/:listId/items/:itemId', (req, res) => {
  ListItems.forEach((item) => {
    if (item.listId === parseInt(req.params.listId) && item.id === parseInt(req.params.itemId)) {
      item.content = req.body.content;
      item.status = req.body.status;
    }
  });
  res.send(ListItems);
});

app.delete('/list/:listId/items/:itemId', (req, res) => {
  ListItems.forEach((item, index) => {
    if (item.listId === parseInt(req.params.listId) && item.id === parseInt(req.params.itemId)) {
      ListItems.splice(index, 1);
    }
  });
  res.send(ListItems);
});

app.listen(3000, () => console.log('listening on port 3000'));
