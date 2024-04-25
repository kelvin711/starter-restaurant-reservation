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

async function seatAtTable(table_id, reservation_id) {
  // Check reservation exists
  const reservation = await knex('reservations')
    .select('*')
    .where({ reservation_id })
    .first();
  if (!reservation) throw new Error(`Reservation with ID ${reservation_id} not found`);

  // Check if the table is occupied and has enough capacity
  const table = await knex('tables')
    .select('*')
    .where({ table_id })
    .first();
  if (!table) throw new Error(`Table with ID ${table_id} not found`);
  if (table.reservation_id) throw new Error(`Table with ID ${table_id} is already occupied`);
  if (table.capacity < reservation.people) throw new Error(`Table does not have sufficient capacity`);

  // Seat the reservation
  await knex('tables')
    .where({ table_id })
    .update({ reservation_id });

  // Update the reservation status
  await knex('reservations')
    .where({ reservation_id })
    .update({ status: 'seated' });
}

async function finishTable(table_id) {
  await knex('tables')
    .where({ table_id })
    .update({ reservation_id: null });
}


module.exports = {
  listTables,
  createTable,
  readTable,
  seatAtTable,
  finishTable
};