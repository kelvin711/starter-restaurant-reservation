/**
 * List handler for reservation resources
 */
const {
    listTables,
    createTable,
    seatAtTable,
    readTable,
    finishTable
} = require("./tables.service");

async function list(req, res, next) {
    try {
        const data = await listTables();
        res.json({ data });
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    const tableData = req.body.data;
    try {
        const data = await createTable(tableData);
        res.status(201).json({ data });
    } catch (error) {
        next(error);
    }
}

async function getTableById(req, res, next) {
    const { table_id } = req.params;

    try {
        const table = await readTable(table_id);
        if (!table) {
            return res.status(404).json({ error: `Table with ID ${table_id} not found.` });
        }
        res.json({ data: table });
    } catch (error) {
        next(error);
    }
}

async function seat(req, res, next) {
    const { table_id } = req.params;
    const { reservation_id } = req.body.data;

    try {
        await seatAtTable(table_id, reservation_id);
        res.status(200).json({ data: { status: 'seated' } });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }
}

async function completeTable(req, res, next) {
    const { table_id } = req.params;
    try {
      const table = await readTable(table_id);
      if (!table) {
        return res.status(404).json({ error: `Table with ID ${table_id} not found.` });
      }
      if (!table.reservation_id) {
        return res.status(400).json({ error: "Table is not occupied." });
      }
  
      await finishTable(table_id);
      res.status(200).json({ data: { message: "Table has been cleared." } });
    } catch (error) {
      next(error);
    }
  }
  

module.exports = {
    list,
    create,
    seat,
    completeTable,
    getTableById,
};