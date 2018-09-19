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
  db.then(dbFile => dataBaseFunctions.getAllTableLists(dbFile))
    .then((lists) => {
      res.send(lists);
    });
});

app.post('/lists', (req, res) => {
  db.then((data) => {
    dataBaseFunctions.createTable(data);
    return data;
  }).then((data) => {
    // const { id } = req.body;
    const { name } = req.body;
    console.log(req.body);
    dataBaseFunctions.insertTableLists(data, name);
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
  db.then((dbFile) => {
    const listId = parseInt(req.params.listId, 10);
    return dataBaseFunctions.getAllTableItems(dbFile, listId);
  }).then((items) => {
    res.send(items);
  });
});

app.post('/list/:listId/items', (req, res) => {
  db.then((dbFile) => {
    dataBaseFunctions.createItemTable(dbFile);
    return dbFile;
  }).then((dbFile) => {
    const item = {
      content: req.body.content,
      status: 'false',
      listId: parseInt(req.params.listId, 10),
    };
    dataBaseFunctions.createTableItems(dbFile, item);
    res.send(item);
  });
});


// Getting, Updating and Deleting individual list items

app.get('/list/:listId/items/:itemId', (req, res) => {
  db.then((dbFile) => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.getSpecificItem(dbFile, itemId, listId);
  }).then((item) => {
    res.send(item);
  });
});

app.put('/list/:listId/items/:itemId', (req, res) => {
  db.then((dbFile) => {
    const item = {
      listId: parseInt(req.params.listId, 10),
      itemId: parseInt(req.params.itemId, 10),
      status: req.body.status,
    };
    return dataBaseFunctions.addItem(dbFile, item);
  }).then((updatedItem) => {
    res.send(updatedItem);
  });
});

app.delete('/list/:listId/items/:itemId', (req, res) => {
  db.then((dbFile) => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.deleteItem(dbFile, itemId, listId);
  }).then(() => {
    res.send('deleted item succesfully');
  });
});

app.listen(3000, () => console.log('listening on port 3000'));
