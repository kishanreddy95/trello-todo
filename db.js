const SQL = require('sql-template-strings');
const sqlite = require('sqlite');
const Promise = require('bluebird');

const db = sqlite.open('./trello.sqlite', { Promise });


module.exports = {
  createTable: () => {
    const tableCreation = 'CREATE TABLE IF NOT EXISTS List(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null)';
    db.then(res => res.run(tableCreation));
  },
  insertTableLists: (name) => {
    const itemInsertion = SQL`INSERT into List (name) values (${name})`;
    const newList = SQL`SELECT * from List where name=${name}`;
    return db.then((res) => {
      res.run(itemInsertion);
      return res;
    }).then(res => res.get(newList));
  },
  selectTableLists: (id) => {
    const tableList = SQL`SELECT * from List where id=${id}`;
    return db.then(res => res.get(tableList));
  },
  deleteTableLists: (id) => {
    const tableListToBeDeleted = SQL`DELETE from List where id=${id}`;
    const deletedTableList = SQL`SELECT * from List where id=${id}`;
    return db.then((res) => {
      const item = res.get(deletedTableList);
      res.run(tableListToBeDeleted);
      return item;
    });
  },
  getAllTableLists: () => {
    const tableLists = SQL`SELECT * from List`;
    return db.then(res => res.all(tableLists));
  },
  createItemTable: () => {
    const itemTableCreation = 'CREATE TABLE IF NOT EXISTS List_Items(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT not null, status TEXT not null, list_id INTEGER, CONSTRAINT fk_item FOREIGN KEY (list_id) REFERENCES List(id) ON DELETE CASCADE)';
    return db.then(res => res.run(itemTableCreation));
  },
  createTableItems: (item) => {
    const itemCreation = SQL`INSERT into List_Items(content, status, list_id) values (${item.content}, ${item.status}, ${item.listId})`;
    return db.then(res => res.run(itemCreation));
  },
  getAllTableItems: (listId) => {
    const itemList = SQL`SELECT * from List_Items where list_id=${listId}`;
    return db.then(res => res.all(itemList));
  },
  getSpecificItem: (itemId, listId) => {
    const item = SQL`SELECT * from List_Items where id=${itemId} AND list_id=${listId}`;
    return db.then(res => res.get(item));
  },
  updateItem: (item) => {
    const addItem = SQL`UPDATE List_Items SET status=${item.status} where id=${item.itemId} AND list_id=${item.listId}`;
    const itemToReturn = SQL`SELECT * from List_Items where id=${item.itemId} AND list_id=${item.listId}`;
    return db.then((res) => {
      res.run(addItem);
      return res;
    }).then(res => res.get(itemToReturn));
  },
  deleteItem: (itemId, listId) => {
    const deleteItem = SQL`DELETE from List_Items where id=${itemId} AND list_id=${listId}`;
    const deletedTableItem = SQL`SELECT * from List where id=${itemId}`;
    return db.then((res) => {
      const item = res.get(deletedTableItem);
      res.run(deleteItem);
      return item;
    });
  },
};
