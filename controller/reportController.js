const db = require("../database");

const getCustomerOpeningBalance = async (req, res) => {
    let conn;
    console.log(req.body)
    const {custno}=req.body
    try {
        conn = await db.getConnection();
        const query = `call getopeningbalance(?,CURRENT_DATE());`;
        const [rows] = await conn.execute(query,[custno]);
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
    const {fromdate,todate,custno}=req.body
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


module.exports = {
    getCustomerOpeningBalance,
    getCustomerTransactions
}