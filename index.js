const express = require('express');
const path = require('path');

const app = express();

// app.get('/', (req, res) => res.send('hello world'));

const List = [
  {
    name: 'kishan',
    id: 1,
  },
];

const ListItems = [
  {
    listId: 1,
    id: 1,
    content: 'hello',
    status: 'false',
  },
  {
    listId: 2,
    id: 7,
    content: 'okay',
    status: 'false',
  },
  {
    listId: 1,
    id: 3,
    content: 'alright',
    status: 'false',
  },
];

app.use(express.static('public'));
app.use(express.json());


// All Lists available
app.get('/lists', (req, res) => {
  res.send(List);
});

app.post('/lists', (req, res) => {
  const newList = {
    name: req.body.name,
    id: req.body.id,
  };
  List.push(newList);
  console.log(req.body);
  res.send(newList);
});

// Getting or deleting a particular List

app.get('/lists/:listId', (req, res) => {
  const listReq = List.filter((list) => {
    if (parseInt(req.params.listId) === list.id) {
      return list;
    }
  });
  res.send(listReq);
});

app.delete('/lists/:listId', (req, res) => {
  List.forEach((list, index) => {
    if (req.params.listId === list.id) {
      List.splice(index, 1);
    }
  });
  res.send('done');
});

// Getting and Creating list items

app.get('/list/:listId/items', (req, res) => {
  const listItems = ListItems.filter((item) => {
    if (parseInt(req.params.listId) === item.listId) {
      return item;
    }
  });
  res.send(listItems);
});

app.post('/list/:listId/items', (req, res) => {
  const item = {
    listId: parseInt(req.params.listId),
    id: req.body.id,
    content: req.body.content,
    status: 'false',
  };
  ListItems.push(item);
  res.send(item);
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
