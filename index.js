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
      if (lists.length === 0) {
        const err = new Error('No Lists Available');
        err.status = 200;
        throw err;
      }
      res.send(lists);
    }).catch((err) => {
      res.status(err.status).send(err.message);
    });
});

app.post('/lists', (req, res) => {
  db.then(() => {
    dataBaseFunctions.createTable();
  }).then(() => {
    const { name } = req.body;
    if (!name || !isNaN(name) || name === '') {
      const err = new Error('Error: Invalid List Name');
      err.status = 406;
      throw err;
    }
    return dataBaseFunctions.insertTableLists(name);
  }).then((list) => {
    res.send(list);
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });
});

// Getting or deleting a particular List

app.get('/lists/:listId', (req, res) => {
  db.then(() => dataBaseFunctions.selectTableLists(req.params.listId))
    .then((resp) => {
      if (!resp) {
        const err = new Error('Error: List Not Found');
        err.status = 404;
        throw err;
      }
      res.send(resp);
    }).catch((err) => {
      res.status(err.status).send(err.message);
    });
});

app.delete('/lists/:listId', (req, res) => {
  db.then(() => dataBaseFunctions.deleteTableLists(req.params.listId))
    .then((list) => {
      if (!list) {
        const err = new Error('Error: List Not Found');
        err.status = 404;
        throw err;
      }
      res.send(list);
    }).catch((err) => {
      res.status(err.status).send(err.message);
    });
});

// Getting and Creating list items

app.get('/lists/:listId/items', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    return dataBaseFunctions.getAllTableItems(listId);
  }).then((items) => {
    if (!items) {
      const err = new Error('List Not Available');
      err.status = 404;
      throw err;
    }
    if (items.length === 0) {
      const err = new Error('List Has No Items');
      err.status = 200;
      throw err;
    }
    res.send(items);
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });
});

app.post('/lists/:listId/items', (req, res) => {
  db.then(() => dataBaseFunctions.createItemTable())
    .then(() => {
      const { content } = req.body;
      if (!content || content === '') {
        const err = new Error('Error: Invalid Item Content');
        err.status = 406;
        throw err;
      }
      const item = {
        content: req.body.content,
        status: 'false',
        listId: parseInt(req.params.listId, 10),
      };
      dataBaseFunctions.createTableItems(item);
      res.send(item);
    }).catch((err) => {
      res.status(err.status).send(err.message);
    });
});


// Getting, Updating and Deleting individual list items

app.get('/lists/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.getSpecificItem(itemId, listId);
  }).then((item) => {
    if (!item) {
      const err = new Error('Item Not Found');
      err.status = 404;
      throw err;
    }
    res.send(item);
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });
});

app.put('/lists/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    if (req.params.status !== 'true' || req.params.status !== 'false') {
      const err = new Error('Error: Invalid status request');
      err.status = 406;
      throw err;
    }
    const item = {
      listId: parseInt(req.params.listId, 10),
      itemId: parseInt(req.params.itemId, 10),
      status: req.body.status,
    };
    return dataBaseFunctions.updateItem(item);
  }).then((updatedItem) => {
    res.send(updatedItem);
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });
});

app.delete('/lists/:listId/items/:itemId', (req, res) => {
  db.then(() => {
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    return dataBaseFunctions.deleteItem(itemId, listId);
  }).then((deletedItem) => {
    if (!deletedItem) {
      const err = new Error('Error: Item Not Found');
      err.status = 404;
      throw err;
    }
    res.send(deletedItem);
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });
});

app.listen(3000);
