const db = require("../database");

const createProductcategory = async (req, res) => {
    let conn;
    var query,vproductcategoryno,mode;
    try {
        conn = await db.getConnection();
       
        const {productcategoryno, productcategoryname } = req.body;
        vproductcategoryno=productcategoryno
           if (vproductcategoryno===0 || vproductcategoryno===null) {
                query="select nvl((select max(productcategoryno) from productcategorymaster),0)+1 nextproductcategoryno";
                const [nextproductcategoryno]= await conn.query(query);
                vproductcategoryno=nextproductcategoryno[0].nextproductcategoryno
           } 
            query = 'INSERT INTO productcategorymaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vproductcategoryno,productcategoryname])
            res.status(201).json({ productcategoryno:vproductcategoryno, data: 'Productcategory '+ mode });
    } catch (err) {
        console.log('Error whie creating productcategory', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchProductcategorys = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT  productcategory.* FROM productcategorymaster productcategory`;
        const [rows] = await conn.execute(query);
        console.log(rows)
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchProductcategorys', err);
        throw err;
    } finally {
        console.log('product category DB conn released');
        conn.release();
    }
}

const fetchProductcategoryById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const productcategoryno = req.params.productcategoryno;
        query = `SELECT * FROM productcategorymaster WHERE productcategoryno=${productcategoryno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data[0] );
    } catch (err) {
        console.log('Error whie fetchProductcategoryById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateProductcategoryById = async (req, res) => {
    let conn;
    try {
        const {productcategoryno, productcategoryname} = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE productcategorymaster SET productcategoryname=?  WHERE productcategoryno=?';
        const [result] = await conn.execute(query,[productcategoryname, productcategoryno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'Productcategory Updated' });
    } catch (err) {
        console.log('Error whie update ProductcategoryByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteProductcategoryById = async (req, res) => {
    let conn;
    try {
        const productcategoryno = req.params.productcategoryno;
        conn = await db.getConnection();
        query="delete from productcategorymaster where productcategoryno=?"
        const [result]=await conn.execute(query,[productcategoryno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Productcategory Deleted' });
    } catch (err) {
        console.log('Error whie deleteProductcategoryById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchProductcategorys,
    fetchProductcategoryById,
    createProductcategory,
    updateProductcategoryById,
    deleteProductcategoryById
}