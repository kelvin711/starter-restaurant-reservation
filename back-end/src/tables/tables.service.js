const knex = require("../db/connection");

async function listTables() {
  try {
    const tables = await knex('tables')
      .select('*')
      .orderBy('table_name', 'asc');
    return tables;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createTable(tableData) {
  const [createdTable] = await knex('tables')
    .insert(tableData)
    .returning('*');
  return createdTable;
}

async function readTable(table_id) {
  const table = await knex('tables')
    .select('*')
    .where({ table_id })
    .first();
  return table; // This will be `undefined` if the table does not exist
}


module.exports = {
  listTables,
  createTable,
  readTable,
};