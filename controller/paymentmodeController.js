const db = require("../database");

const createPaymentmode = async (req, res) => {
    let conn;
    var query,vpaymentmodeno,mode;
    try {
        conn = await db.getConnection();
       
        const {paymentmodeno ,paymentmodename ,paymentmodeaddress ,paymentmodephone1 ,paymentmodephone2 ,paymentmodeemail ,openingbalance  } = req.body;
        vpaymentmodeno=paymentmodeno
           if (vpaymentmodeno===0 || vpaymentmodeno===null||vpaymentmodeno=="") {
                query="select nvl((select max(v) from paymentmodemaster),0)+1 nextpaymentmodeno";
                const [nextpaymentmodeno]= await conn.query(query);
                vpaymentmodeno=nextpaymentmodeno[0].nextpaymentmodeno
           } 
            query = 'INSERT INTO paymentmodemaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vpaymentmodeno,paymentmodename ,paymentmodeaddress ,paymentmodephone1 ,paymentmodephone2 ,paymentmodeemail ,openingbalance])
            res.status(201).json({ paymentmodeno:vpaymentmodeno, data: 'Paymentmode '+ mode,result: "pass" });
    } catch (err) {
        console.log('Error whie creating paymentmode', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchPaymentmodes = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT paymentmode.* FROM paymentmode paymentmode`;
        const [rows] = await conn.execute(query);9
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchPaymentmodes', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchPaymentmodeById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const paymentmodeno = req.params.paymentmodeno;
        query = `SELECT * FROM paymentmodemaster WHERE paymentmodeno=${paymentmodeno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data[0] );
    } catch (err) {
        console.log('Error whie fetchPaymentmodeById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updatePaymentmodeById = async (req, res) => {
    let conn;
    try {
        const {paymentmodeno ,paymentmodename ,paymentmodeaddress ,paymentmodephone1 ,paymentmodephone2 ,paymentmodeemail ,openingbalance  } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE paymentmodemaster SET paymentmodename=? ,paymentmodeaddress=? ,paymentmodephone1=? ,paymentmodephone2=? ,paymentmodeemail=? ,openingbalance=?   WHERE paymentmodeno=?';
        const [result] = await conn.execute(query,[paymentmodename ,paymentmodeaddress ,paymentmodephone1 ,paymentmodephone2 ,paymentmodeemail ,openingbalance, paymentmodeno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Paymentmode Updated' });
    } catch (err) {
        console.log('Error whie update PaymentmodeByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deletePaymentmodeById = async (req, res) => {
    let conn;
    try {
        const paymentmodeno = req.params.paymentmodeno;
        conn = await db.getConnection();
        query="delete from paymentmodemaster where paymentmodeno=?"
        const [result]=await conn.execute(query,[paymentmodeno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Paymentmode Deleted' });
    } catch (err) {
        console.log('Error whie deletePaymentmodeById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchPaymentmodes,
    fetchPaymentmodeById,
    createPaymentmode,
    updatePaymentmodeById,
    deletePaymentmodeById
}