const db = require("../database");

const createSupplier = async (req, res) => {
    let conn;
    var query,vsupplierno,mode;
    try {
        conn = await db.getConnection();
       
        const {supplierno ,suppliername ,supplieraddress ,supplierphone1 ,supplierphone2 ,supplieremail ,openingbalance  } = req.body;
        vsupplierno=supplierno
           if (vsupplierno===0 || vsupplierno===null ||vsupplierno==="") {
                query="select nvl((select max(supplierno) from suppliermaster),0)+1 nextsupplierno";
                const [nextsupplierno]= await conn.query(query);
                vsupplierno=nextsupplierno[0].nextsupplierno
           } 
            query = 'INSERT INTO suppliermaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.query(query, [vsupplierno,suppliername ,supplieraddress ,supplierphone1 ,supplierphone2 ,supplieremail ,openingbalance])
            res.status(201).json({ supplierno:vsupplierno, data: 'Supplier '+ mode,result: 'pass' });
    } catch (err) {
        console.log('Error whie creating supplier', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchSuppliers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT supplier.* FROM suppliermaster supplier`;
        const [rows] = await conn.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchSuppliers', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchSupplierById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const supplierno = req.params.supplierno;
        query = `SELECT * FROM suppliermaster WHERE supplierno=?`;
        const [rows] = await conn.query(query,[supplierno]);
        var data = rows
        res.status(200).json( data[0] );
    } catch (err) {
        console.log('Error whie fetchSupplierById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateSupplierById = async (req, res) => {
    let conn;
    try {
        const {supplierno ,suppliername ,supplieraddress ,supplierphone1 ,supplierphone2 ,supplieremail ,openingbalance  } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE suppliermaster SET suppliername=? ,supplieraddress=? ,supplierphone1=? ,supplierphone2=? ,supplieremail=? ,openingbalance=?   WHERE supplierno=?';
        const [result] = await conn.query(query,[suppliername ,supplieraddress ,supplierphone1 ,supplierphone2 ,supplieremail ,openingbalance, supplierno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Supplier Updated',result: 'pass' });
    } catch (err) {
        console.log('Error whie update SupplierByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteSupplierById = async (req, res) => {
    let conn;
    try {
        const supplierno = req.params.supplierno;
        conn = await db.getConnection();
        query="delete from suppliermaster where supplierno=?"
        const [result]=await conn.query(query,[supplierno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Supplier Deleted' });
    } catch (err) {
        console.log('Error whie deleteSupplierById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchSuppliers,
    fetchSupplierById,
    createSupplier,
    updateSupplierById,
    deleteSupplierById
}