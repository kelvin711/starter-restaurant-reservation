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
  return await knex.transaction(async trx => {
    // Check if the reservation exists and its status
    const reservation = await trx('reservations')
      .select('*')
      .where({ reservation_id })
      .first();

    if (!reservation) {
      throw new Error(`Reservation with ID ${reservation_id} does not exist.`);
    }

    // If the reservation is already seated, throw an error
    if (reservation.status === 'seated') {
      throw new Error(`Reservation with ID ${reservation_id} is already seated.`);
    }

    // Check if the table exists and if it's already occupied
    const table = await trx('tables')
      .select('*')
      .where({ table_id })
      .first();

    if (!table) {
      throw new Error(`Table with ID ${table_id} not found`);
    }

    if (table.reservation_id) {
      throw new Error(`Table with ID ${table_id} is already occupied`);
    }

    // Check if table has sufficient capacity
    if (table.capacity < reservation.people) {
      throw new Error(`Table does not have sufficient capacity`);
    }

    // Seat the reservation
    await trx('tables')
      .where({ table_id })
      .update({ reservation_id });

    // Update the reservation status to 'seated'
    await trx('reservations')
      .where({ reservation_id })
      .update({ status: 'seated' });
  });
}

async function finishTable(table_id) {
  await knex.transaction(async trx => {
    const table = await trx('tables')
      .where({ table_id })
      .first();
    if (!table) {
      throw new Error('Table with ID ${table_id} does not exist.');
    }
    if (!table.reservation_id) {
      throw new Error('Table is not occupied.');
    }

    // Get reservation_id before clearing the table
    const reservation_id = table.reservation_id;

    // Clear the table
    await trx('tables')
      .where({ table_id })
      .update({ reservation_id: null });

    // Set reservation status to 'finished'
    await trx('reservations')
      .where({ reservation_id })
      .update({ status: 'finished' });
  });
}



module.exports = {
  listTables,
  createTable,
  readTable,
  seatAtTable,
  finishTable
};