const db = require("../database");

const createCenter = async (req, res) => {
    let conn;
    var query,vcenterno,mode;
    try {
        conn = await db.getConnection();
       
        const {centerno ,centername ,centeraddress ,centerphone1 ,centerphone2 ,centeremail ,openingbalance  } = req.body;
        vcenterno=centerno
           if (vcenterno===0 || vcenterno===null) {
                query="select nvl((select max(v) from centermaster),0)+1 nextcenterno";
                const [nextcenterno]= await conn.query(query);
                vcenterno=nextcenterno[0].nextcenterno
           } 
            query = 'INSERT INTO centermaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vcenterno,centername ,centeraddress ,centerphone1 ,centerphone2 ,centeremail ,openingbalance])
            res.status(201).json({ centerno:vcenterno, data: 'Center '+ mode });
    } catch (err) {
        console.log('Error whie creating center', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchCenters = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT center.* FROM centermaster center`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchCenterById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const centerno = req.params.centerno;
        query = `SELECT * FROM centermaster WHERE centerno=${centerno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data[0] );
    } catch (err) {
        console.log('Error whie fetchCenterById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateCenterById = async (req, res) => {
    let conn;
    try {
        const {centerno ,centername ,centeraddress ,centerphone1 ,centerphone2 ,centeremail ,openingbalance  } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE centermaster SET centername=? ,centeraddress=? ,centerphone1=? ,centerphone2=? ,centeremail=? ,openingbalance=?   WHERE centerno=?';
        const [result] = await conn.execute(query,[centername ,centeraddress ,centerphone1 ,centerphone2 ,centeremail ,openingbalance, centerno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Center Updated' });
    } catch (err) {
        console.log('Error whie update CenterByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteCenterById = async (req, res) => {
    let conn;
    try {
        const centerno = req.params.centerno;
        conn = await db.getConnection();
        query="delete from centermaster where centerno=?"
        const [result]=await conn.execute(query,[centerno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Center Deleted' });
    } catch (err) {
        console.log('Error whie deleteCenterById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchCenters,
    fetchCenterById,
    createCenter,
    updateCenterById,
    deleteCenterById
}