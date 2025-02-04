const db = require("../database");

const createSupplierpayment = async (req, res) => {
    let conn;
    var query,vsupplierpaymentno,mode;
    try {
        conn = await db.getConnection();
       
        const {supplierpaymentno,supplierpaymentdate,supplierno,paymentamount,paymentmodeno,documentnumber,remarks  } = req.body;
        vsupplierpaymentno=supplierpaymentno
           if (vsupplierpaymentno===0 || vsupplierpaymentno===null|| vsupplierpaymentno==="") {
                query="select nvl((select max(supplierpaymentno) from supplierpayment),0)+1 nextsupplierpaymentno";
                const [nextsupplierpaymentno]= await conn.query(query);
                vsupplierpaymentno=nextsupplierpaymentno[0].nextsupplierpaymentno
           } 
            query = 'INSERT INTO supplierpayment values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vsupplierpaymentno,supplierpaymentdate,supplierno,paymentamount,paymentmodeno,documentnumber,remarks])
            res.status(201).json({ supplierno:vsupplierpaymentno, data: 'Supplierpayment '+ mode,result:"pass" });
    } catch (err) {
        console.log('Error whie creating supplierpayment', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchSupplierpayments = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT suppliermaster.suppliername,supplierpayment.* FROM supplierpayment inner join suppliermaster on suppliermaster.supplierno=supplierpayment.supplierno`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchSupplierpayments', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchSupplierpaymentById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const supplierpaymentno = req.params.supplierpaymentno;
        query = `SELECT * FROM supplierpayment WHERE supplierpaymentno=${supplierpaymentno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchSupplierpaymentById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateSupplierpaymentById = async (req, res) => {
    let conn;
    try {
        const {supplierpaymentno,supplierpaymentdate,supplierno,paymentamount,paymentmodeno,documentnumber,remarks  } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE supplierpayment SET supplierpaymentdate=?,supplierno=?,paymentamount=?,paymentmodeno=?,documentnumber=?,remarks=?   WHERE supplierpaymentno=?';
        const [result] = await conn.execute(query,[supplierpaymentdate,supplierno,paymentamount,paymentmodeno,documentnumber,remarks,supplierpaymentno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Supplierpayment Updated',result:"pass" });
    } catch (err) {
        console.log('Error whie update SupplierpaymentByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteSupplierpaymentById = async (req, res) => {
    let conn;
    try {
        const supplierpaymentno = req.params.supplierpaymentno;
        conn = await db.getConnection();
        query="delete from supplierpayment where supplierpaymentno=?"
        const [result]=await conn.execute(query,[supplierpaymentno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Supplierpayment Deleted' });
    } catch (err) {
        console.log('Error whie deleteSupplierpaymentById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchSupplierpayments,
    fetchSupplierpaymentById,
    createSupplierpayment,
    updateSupplierpaymentById,
    deleteSupplierpaymentById
}