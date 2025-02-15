const db = require("../database");

const getCustomerOpeningBalance = async (req, res) => {
    let conn;
    console.log(req.body)
    const {custno,fromdate}=req.body
    try {
        conn = await db.getConnection();
        const query = `call getopeningbalance(?,?);`;
        const [rows] = await conn.execute(query,[custno,fromdate]);
        res.status(200).json(rows[0]);
    } catch (err) {     
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const getCustomerTransactions = async (req, res) => {
    let conn;
    console.log(req.body)
    const {custno,fromdate,todate}=req.body
    try {
        conn = await db.getConnection();
        const query = `select * from transactions where transactions.custno=? and tdate between ? and ? order by tdate`;
        const [rows] = await conn.execute(query,[custno,fromdate,todate]);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const getItemOpeningBalance = async (req, res) => {
    let conn;
    console.log(req.body)
    const {centerno,productno,fromdate}=req.body
    try {
        conn = await db.getConnection();
        const query = `call getopeningbalanceitem(?,?,?);`;
        const [rows] = await conn.execute(query,[centerno,productno,fromdate]);
        res.status(200).json(rows[0]);
    } catch (err) {     
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const getItemTransactions = async (req, res) => {
    let conn;
    console.log(req.body)
    const {centerno,productno,fromdate,todate}=req.body
    try {
        conn = await db.getConnection();
        const query = `select * from itemtransactions where itemtransactions.centerno=? and itemtransactions.productno=? and tdate between ? and ? order by tdate`;
        const [rows] = await conn.execute(query,[centerno,productno,fromdate,todate]);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}


module.exports = {
    getCustomerOpeningBalance,
    getCustomerTransactions,
    getItemOpeningBalance,
    getItemTransactions
}