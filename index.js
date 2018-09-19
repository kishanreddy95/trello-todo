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
  db.then(() => dataBaseFunctions.getAllTableLists())
    .then((lists) => {
      res.send(lists);
    });
});

app.post('/lists', (req, res) => {
  db.then(() => {
    dataBaseFunctions.createTable();
  }).then(() => {
    const { name } = req.body;
    return dataBaseFunctions.insertTableLists(name);
  }).then((list) => {
    res.send(list);
  });
});

// Getting or deleting a particular List

app.get('/lists/:listId', (req, res) => {
  db.then(() => dataBaseFunctions.selectTableLists(req.params.listId))
    .then((resp) => {
      res.send(resp);
    });
});

app.delete('/lists/:listId', (req, res) => {
  db.then(() => dataBaseFunctions.deleteTableLists(req.params.listId))
    .then((list) => {
      res.send(list);
    });
});

// Getting and Creating list items

app.get('/list/:listId/items', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    return dataBaseFunctions.getAllTableItems(listId);
  }).then((items) => {
    res.send(items);
  });
});

app.post('/list/:listId/items', (req, res) => {
  db.then(() => dataBaseFunctions.createItemTable())
    .then(() => {
      const item = {
        content: req.body.content,
        status: 'false',
        listId: parseInt(req.params.listId, 10),
      };
      dataBaseFunctions.createTableItems(item);
      res.send(item);
    });
});


// Getting, Updating and Deleting individual list items

app.get('/list/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.getSpecificItem(itemId, listId);
  }).then((item) => {
    res.send(item);
  });
});

app.put('/list/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    const item = {
      listId: parseInt(req.params.listId, 10),
      itemId: parseInt(req.params.itemId, 10),
      status: req.body.status,
    };
    return dataBaseFunctions.updateItem(item);
  }).then((updatedItem) => {
    res.send(updatedItem);
  });
});

app.delete('/list/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.deleteItem(itemId, listId);
  }).then((deletedItem) => {
    res.send(deletedItem);
  });
});

app.listen(3000, () => console.log('listening on port 3000'));
