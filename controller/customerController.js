const db = require("../database");

const createCustomer = async (req, res) => {
    let conn;
    var query,vcustomerno,mode;
    try {
        conn = await db.getConnection();
       
        const {custno ,customername ,customeraddress ,customerphone1 ,customerphone2 ,customeremail ,openingbalance  } = req.body;

        vcustomerno=Number(custno)
        console.log(vcustomerno)
           if (vcustomerno===0 || vcustomerno===null)  {
                query="select nvl((select max(custno) from customermaster),0)+1 nextcustomerno";
                const [nextcustomerno]= await conn.query(query);
                vcustomerno=nextcustomerno[0].nextcustomerno
           } 
            query = 'INSERT INTO customermaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vcustomerno,customername ,customeraddress ,customerphone1 ,customerphone2 ,customeremail ,openingbalance])
            res.status(201).json({ custno:vcustomerno, data: 'Customer '+ mode,result: 'pass' });
    } catch (err) {
        console.log('Error whie creating customer', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchCustomers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT customer.* FROM customermaster customer`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchCustomers', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchCustomerById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const customerno = req.params.customerno;
        query = `SELECT * FROM customermaster WHERE custno=${customerno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchCustomerById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateCustomerById = async (req, res) => {
    let conn;
    try {
        const {custno ,customername ,customeraddress ,customerphone1 ,customerphone2 ,customeremail ,openingbalance  } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE customermaster SET customername=? ,customeraddress=? ,customerphone1=? ,customerphone2=? ,customeremail=? ,openingbalance=?   WHERE custno=?';
        const [result] = await conn.execute(query,[customername ,customeraddress ,customerphone1 ,customerphone2 ,customeremail ,openingbalance, custno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Customer Updated',result: 'pass' });
    } catch (err) {
        console.log('Error whie update CustomerByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteCustomerById = async (req, res) => {
    let conn;
    try {
        const customerno = req.params.customerno;
        conn = await db.getConnection();
        query="delete from customermaster where custno=?"
        const [result]=await conn.execute(query,[customerno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Customer Deleted' });
    } catch (err) {
        console.log('Error whie deleteCustomerById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById
}