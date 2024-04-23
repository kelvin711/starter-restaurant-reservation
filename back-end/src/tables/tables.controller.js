/**
 * List handler for reservation resources
 */
const {
    listTables,
    readTable
} = require("./tables.service");

async function list(req, res, next) {
    try {
        const data = await listTables();
        res.json({ data });
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
module.exports = {
    list,
    getTableById,
};