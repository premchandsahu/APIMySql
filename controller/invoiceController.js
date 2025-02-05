const db = require("../database");

const createInvoice = async (req, res) => {
    let conn;
    var query,vinvoiceno,mode;
    try {
        conn = await db.getConnection();
        console.log(req.body)    
        const {invoiceno,centerno,invoicedate,custno,total,remarks,details } = req.body;
        vinvoiceno=invoiceno
        console.log('invoiceno',vinvoiceno,centerno,invoicedate,custno,total,remarks,details )
           if (vinvoiceno===0 || vinvoiceno===null || vinvoiceno==="") {
                query="select nvl((select max(invoiceno) from invoicemaster where centerno=?),0)+1 nextinvoiceno";
                const [nextinvoiceno]= await conn.query(query,[centerno]);
                vinvoiceno=nextinvoiceno[0].nextinvoiceno
                mode="created"
           } 
           else {
                query="delete from invoiceline where centerno=? and invoiceno=?"
                await conn.query(query,[centerno,vinvoiceno]);
                query="delete from invoicemaster where centerno=? and invoiceno=?"
                await conn.query(query,[centerno,vinvoiceno]);
                mode="modified"
           }
           console.log("calculate invoiceno",vinvoiceno)
            query = 'INSERT INTO invoicemaster values (?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vinvoiceno,invoicedate,custno,centerno,total,remarks])
            query = 'INSERT INTO invoiceline values (?,?,?,?,?,?) '; 
            for (let i in details){
                await conn.query(query,[vinvoiceno,centerno,details[i].productno,details[i].productqty,details[i].productrate,details[i].total]);
            }
        res.status(201).json({ invoiceno:vinvoiceno, result: 'pass' });
    } catch (err) {
        console.log('Error whie creating invoice', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchInvoices = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT customer.customername,invoice.* FROM invoicemaster invoice inner join customermaster customer on customer.custno=invoice.custno order by invoice.invoiceno`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchInvoices', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}



const fetchInvoiceById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const invoiceno = req.params.invoiceno;
        const centerno = req.params.centerno;
        query = `SELECT * FROM invoicemaster WHERE invoiceno=${invoiceno} and centerno=${centerno}`;
        const [rows] = await conn.execute(query);
        query = `SELECT productno,productqty,productrate,total FROM invoiceline WHERE invoiceno=${invoiceno} and centerno=${centerno}`;
        const [rowsd] = await conn.execute(query);
        var data = rows
        data[0].details =await rowsd 
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchInvoiceById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateInvoiceById = async (req, res) => {
    let conn;
    try {
        const { task_name, is_done } = req.body;
        const id = parseInt(req.params.id);
        conn = await db.getConnection();
        const query =
            'UPDATE tasks SET task_name=?, is_done=?, updated_at=? WHERE id=?';
        const [result] = await conn.execute(query,
            [task_name, is_done, new Date(), id]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Task Updated' });
    } catch (err) {
        console.log('Error whie updateTaskById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteInvoiceById = async (req, res) => {
    let conn;
    try {
        const invoiceno = req.params.invoiceno;
        const centerno = req.params.centerno;
        conn = await db.getConnection();
        query="delete from invoiceline where centerno=? and invoiceno=?"
        const [resultl]=await conn.execute(query,[centerno,invoiceno]);
        query="delete from invoicemaster where centerno=? and invoiceno=?"
        const [result]=await conn.execute(query,[centerno,invoiceno]);
        console.log('Rows affected:', result.affectedRows,'Rows affeccted lines:',resultl.affectedRows);
        res.status(200).json({ data: 'Invoice Deleted' });
    } catch (err) {
        console.log('Error whie deleteInvoiceById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const InvoiceSummary = async (req, res) => {
    let conn,customerfilter,finalquery,centerfilter;
    const {fromdate,todate,custno,centerno} =await req.body
    const vecenterno=centerno?centerno:1
    centerfilter=centerno?` and invoicem.centerno=${centerno}`:" "
    customerfilter=custno?` and customer.custno=${custno}`:" "
    try {
        conn = await db.getConnection();
        const query = `SELECT customer.customername,invoicem.invoiceno,invoicem.invoicedate,invoicem.total totalSAmount,sum(invoicel.productqty*pm.purchaserate) totalPAmount,group_concat(pm.name,':',invoicel.productqty,'x',invoicel.productrate,'=',invoicel.total ) description 
                        FROM invoiceline invoicel
                        inner join invoicemaster invoicem  on invoicem.invoiceno=invoicel.invoiceno and invoicem.centerno=invoicel.centerno
                        inner join productmaster pm on invoicel.productno=pm.productno
                        inner join customermaster customer on customer.custno=invoicem.custno
                        inner join productmaster product on product.productno=invoicel.productno 
                        where invoicedate between '${fromdate}' and  STR_TO_DATE('${todate}','%Y-%m-%d') `;
                      finalquery=await query.concat(centerfilter,customerfilter,"  group by customer.customername,invoicem.invoiceno,invoicem.invoicedate,invoicem.total order by invoicem.invoiceno" )                          
        const [rows] = await conn.execute(finalquery);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchInvoices', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceById,
    deleteInvoiceById,
    InvoiceSummary
}