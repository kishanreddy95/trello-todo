const SQL = require('sql-template-strings');

module.exports = {
  createTable: (db) => {
    const tableCreation = 'CREATE TABLE IF NOT EXISTS List(id INTEGER PRIMARY KEY, name TEXT not null)';
    return db.run(tableCreation);
  },
  insertTableLists: (db, id, name) => {
    const itemInsertion = SQL`INSERT into List (id, name) values (${id}, ${name})`;
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
  createTableItems: (db) => {
    const itemTableCreation = SQL`CREATE TABLE IF NOT EXISTS List_Items(id INTEGER PRIMARY KEY, content TEXT not null, list_id INTEGER, status TEXT not null, CONSTRAINT fkey_list FORIEGN KEY (list_id) REFERENCES List(id) ON DELETE CASCADE)`;
    return db.run(itemTableCreation);
  },
};
