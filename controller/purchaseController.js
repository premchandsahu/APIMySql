const db = require("../database");

const createPurchase = async (req, res) => {
    let conn;
    var query,vpurchaseno,mode;
    try {
        conn = await db.getConnection();
       
        const {purchaseno, purchasedate,supplierno,centerno,total,remarks,details } = req.body;
        vpurchaseno=purchaseno
        console.log('purchaseno',vpurchaseno)
           if (vpurchaseno===0 || vpurchaseno===null|| vpurchaseno==="") {
                query="select nvl((select max(purchaseno) from purchasemaster where centerno=?),0)+1 nextpurchaseno";
                const [nextpurchaseno]= await conn.query(query,[centerno]);
                vpurchaseno=nextpurchaseno[0].nextpurchaseno
                mode="created"
           } 
           else {
                query="delete from purchaseline where centerno=? and purchaseno=?"
                await conn.query(query,[centerno,vpurchaseno]);
                query="delete from purchasemaster where centerno=? and purchaseno=?"
                await conn.query(query,[centerno,vpurchaseno]);
                mode="modified"
           }
            query = 'INSERT INTO purchasemaster values (?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vpurchaseno,purchasedate,supplierno,centerno,total,remarks])
            query = 'INSERT INTO purchaseline values (?,?,?,?,?,?) '; 
            for (let i in details){
                await conn.query(query,[vpurchaseno,centerno,details[i].productno,details[i].productqty,details[i].productrate,details[i].total]);
            }
        res.status(201).json({ purchaseno:vpurchaseno, data: 'Purchase '+ mode,result:"pass" });
    } catch (err) {
        console.log('Error whie creating purchase', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchPurchases = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT supplier.suppliername,purchase.* FROM purchasemaster purchase inner join suppliermaster supplier on supplier.supplierno=purchase.supplierno`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchPurchases', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchPurchaseById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const purchaseno = req.params.purchaseno;
        const centerno = req.params.centerno;
        query = `SELECT * FROM purchasemaster WHERE purchaseno=${purchaseno} and centerno=${centerno}`;
        const [rows] = await conn.execute(query);
        query = `SELECT productno,productqty,productrate,total FROM purchaseline WHERE purchaseno=${purchaseno} and centerno=${centerno}`;
        const [rowsd] = await conn.execute(query);
        var data = rows
        data[0].details =await rowsd 
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchPurchasenoById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updatePurchaseById = async (req, res) => {
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

const deletePurchaseById = async (req, res) => {
    let conn;
    try {
        const purchaseno = req.params.purchaseno;
        const centerno = req.params.centerno;
        conn = await db.getConnection();
        query="delete from purchaseline where centerno=? and purchaseno=?"
        const [resultl]=await conn.execute(query,[centerno,purchaseno]);
        query="delete from purchasemaster where centerno=? and purchaseno=?"
        const [result]=await conn.execute(query,[centerno,purchaseno]);
        console.log('Rows affected:', result.affectedRows,'Rows affeccted lines:',resultl.affectedRows);
        res.status(200).json({ data: 'Purchase Deleted' });
    } catch (err) {
        console.log('Error whie deletePurchaseById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const purchaseSummary = async (req, res) => {
    let conn,customerfilter,finalquery,centerfilter;
    const {fromdate,todate,supplierno,centerno} =await req.body
    const vecenterno=centerno?centerno:1
    centerfilter=centerno?` and purchase.centerno=${centerno}`:" "
    customerfilter=supplierno?` and supplier.supplierno=${supplierno}`:" "
    try {
        conn = await db.getConnection();
        const query = `SELECT supplier.suppliername,purchase.*,purchase.total totalSAmount,0 totalPAmount 
                        FROM purchasemaster purchase 
                        inner join suppliermaster supplier on supplier.supplierno=purchase.supplierno 
                        where purchasedate between '${fromdate}' and  STR_TO_DATE('${todate}','%Y-%m-%d') `;
                      finalquery=await query.concat(centerfilter,customerfilter," order by purchase.purchaseno")                          
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
    fetchPurchases,
    fetchPurchaseById,
    createPurchase,
    updatePurchaseById,
    deletePurchaseById,
    purchaseSummary
}