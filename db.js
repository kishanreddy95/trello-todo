const SQL = require('sql-template-strings');

module.exports = {
  createTable: (db) => {
    const tableCreation = 'CREATE TABLE IF NOT EXISTS List(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null)';
    return db.run(tableCreation);
  },
  insertTableLists: (db, name) => {
    const itemInsertion = SQL`INSERT into List (name) values (${name})`;
    return db.run(itemInsertion);
  },
  selectTableLists: (db, id) => {
    const tableList = SQL`SELECT * from List where id=${id}`;
    return db.get(tableList);
  },
  deleteTableLists: (db, id) => {
    const tableToBeDeleted = SQL`DELETE from List where id=${id}`;
    return db.run(tableToBeDeleted);
  },
  getAllTableLists: (db) => {
    const tableLists = SQL`SELECT * from List`;
    return db.all(tableLists);
  },
  createItemTable: (db) => {
    const itemTableCreation = 'CREATE TABLE IF NOT EXISTS List_Items(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT not null, status TEXT not null, list_id INTEGER, CONSTRAINT fk_item FOREIGN KEY (list_id) REFERENCES List(id) ON DELETE CASCADE)';
    return db.run(itemTableCreation);
  },
  createTableItems: (db, item) => {
    const itemCreation = SQL`INSERT into List_Items(content, status, list_id) values (${item.content}, ${item.status}, ${item.listId})`;
    return db.run(itemCreation);
  },
  getAllTableItems: (db, listId) => {
    const itemList = SQL`SELECT * from List_Items where list_id=${listId}`;
    return db.all(itemList);
  },
  getSpecificItem: (db, itemId, listId) => {
    const item = SQL`SELECT * from List_Items where id=${itemId} AND list_id=${listId}`;
    return db.get(item);
  },
  addItem: (db, item) => {
    const addItem = SQL`UPDATE List_Items SET status=${item.status} where id=${item.itemId} AND list_id=${item.listId}`;
    const itemToReturn = SQL`SELECT * from List_Items where id=${item.itemId} AND list_id=${item.listId}`;
    db.run(addItem);
    return db.get(itemToReturn);
  },
  deleteItem: (db, itemId, listId) => {
    const deleteItem = SQL`DELETE from List_Items where id=${itemId} AND list_id=${listId}`;
    return db.run(deleteItem);
  },
};
