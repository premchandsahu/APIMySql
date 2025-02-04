const express = require('express');
const router = express.Router();
const db = require('../database');

// Create an Invoice
const createInvoice = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
    const { invoicedate,custno,centerno,total,remarks,details } = req.body;
   
    const query1="select nvl((select max(invoiceno) from invoicemaster),0)+1 nextinvoiceno";
    const nextinvoiceno = db.execute(query1)
    console.log(nextinvoiceno)
    const query = 'INSERT INTO invoicemaster with c1 as (select nvl((select max(invoiceno) from invoicemaster),0)+1 nextinvoiceno) select nextinvoiceno,?,?,?,?,? from c1';
    const [result] = await db.execute(query, [invoicedate,custno,centerno,total,remarks])

        if (err) return res.status(500).send(err);
        console.log(result);
        res.status(201).send({ id: result.insertId });
      
    } catch(err){
        console.log('Error whie createTask', err);
        throw err;
    } finally {
        conn.release();
    }

};

// Get all orders
router.get('/', (req, res) => {

    db.query('SELECT * FROM invoicemaster', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Get an order with its items
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    const query = `
        SELECT * FROM Orders WHERE id = ?;
        SELECT * FROM OrderItems WHERE order_id = ?;
    `;
    db.query(query, [orderId, orderId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ order: results[0][0], items: results[1] });
    });
});

// Update an order
router.put('/:id', (req, res) => {
    const orderId = req.params.id;
    const { customer_name, order_date } = req.body;
    const query = 'UPDATE Orders SET customer_name = ?, order_date = ? WHERE id = ?';
    db.query(query, [customer_name, order_date, orderId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: 'Order updated successfully' });
    });
});

// Delete an order
router.delete('/:id', (req, res) => {
    const orderId = req.params.id;
    const query = 'DELETE FROM Orders WHERE id = ?';
    db.query(query, [orderId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: 'Order deleted successfully' });
    });
});

module.exports = router;