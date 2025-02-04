const db = require("../database");

const createCustomerreceipt = async (req, res) => {
    let conn;
    var query,vcustomerreceiptno,mode;
    try {
        conn = await db.getConnection();
       
        const {customerreceiptno,customerreceiptdate,custno,receiptamount,paymentmodeno,documentnumber,remarks  } = req.body;
        console.log(req.body)
        vcustomerreceiptno=customerreceiptno
           if (vcustomerreceiptno===0 || vcustomerreceiptno===null|| vcustomerreceiptno==="") {
                query="select nvl((select max(customerreceiptno) from customerreceipt),0)+1 nextcustomerreceiptno";
                const [nextcustomerreceiptno]= await conn.query(query);
                vcustomerreceiptno=nextcustomerreceiptno[0].nextcustomerreceiptno
           } 
            query = 'INSERT INTO customerreceipt values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vcustomerreceiptno,customerreceiptdate,custno,receiptamount,paymentmodeno,documentnumber,remarks])
            res.status(201).json({ custno:vcustomerreceiptno, data: 'Customerreceipt '+ mode,result:"pass" });
    } catch (err) {
        console.log('Error whie creating customerreceipt', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchCustomerreceipts = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT customermaster.customername,customerreceipt.* FROM customerreceipt inner join customermaster on customermaster.custno=customerreceipt.custno`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCustomerreceipts', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchCustomerreceiptById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const customerreceiptno = req.params.customerreceiptno;
        query = `SELECT * FROM customerreceipt WHERE customerreceiptno=${customerreceiptno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchCustomerreceiptById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateCustomerreceiptById = async (req, res) => {
    let conn;
    try {
        const {customerreceiptno,customerreceiptdate,custno,receiptamount,paymentmodeno,documentnumber,remarks  } = req.body;
        console.log(req.body)
        conn = await db.getConnection();
        const query =
            'UPDATE customerreceipt SET customerreceiptdate=?,custno=?,receiptamount=?,paymentmodeno=?,documentnumber=?,remarks=?   WHERE customerreceiptno=?';
        const [result] = await conn.execute(query,[customerreceiptdate,custno,receiptamount,paymentmodeno,documentnumber,remarks,customerreceiptno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Customerreceipt Updated',result:"pass" });
    } catch (err) {
        console.log('Error whie update CustomerreceiptByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteCustomerreceiptById = async (req, res) => {
    let conn;
    try {
        const customerreceiptno = req.params.customerreceiptno;
        conn = await db.getConnection();
        query="delete from customerreceipt where customerreceiptno=?"
        const [result]=await conn.execute(query,[customerreceiptno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Customerreceipt Deleted' });
    } catch (err) {
        console.log('Error whie deleteCustomerreceiptById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchCustomerreceipts,
    fetchCustomerreceiptById,
    createCustomerreceipt,
    updateCustomerreceiptById,
    deleteCustomerreceiptById
}