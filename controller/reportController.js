const db = require("../database");

const getCustomerOpeningBalance = async (req, res) => {
    let conn;
    console.log(req.body)
    const {custno,fromdate}=req.body
    try {
        conn = await db.getConnection();
        const query = `call getopeningbalance(?,?);`;
        const [rows] = await conn.query(query,[custno,fromdate]);
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
        const query = `select * from transactions where transactions.custno=? and tdate between ? and ? order by tdate,ttype desc,tno`;
        const [rows] = await conn.query(query,[custno,fromdate,todate]);
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
        const [rows] = await conn.query(query,[centerno,productno,fromdate]);
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
        const query = `select * from itemtransactions where itemtransactions.centerno=? and itemtransactions.productno=? and tdate between ? and ? order by tdate,ttype,tno`;
        const [rows] = await conn.query(query,[centerno,productno,fromdate,todate]);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCenters', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}


const getItemSummary = async (req, res) => {
    let conn,rows;
    console.log(req.body)
    const {centerno,fromdate,todate,custno}=req.body
    const customerfilter = custno ? ` and invoicemaster.custno=?` : ""
    try {
        conn = await db.getConnection();
        const query = `select productmaster.productno,productmaster.name,sum(productqty) qty ,sum(productqty*productrate) amount from invoicemaster,invoiceline,productmaster where productmaster.productno=invoiceline.productno and invoicemaster.invoiceno=invoiceline.invoiceno and invoicemaster.centerno=invoiceline.centerno and invoicedate between ? and ?  and invoicemaster.centerno=?`;
        finalquery = await query.concat(customerfilter, "   group by 1,2 order by 2");
        if (custno){
        [rows] = await conn.query(finalquery,[fromdate,todate,centerno,custno]);
        }
        else{
            [rows] = await conn.query(finalquery,[fromdate,todate,centerno]);
        }

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
    getItemTransactions,
    getItemSummary
}