const db = require("../database");

const createProduct = async (req, res) => {
    let conn;
    var query,vproductno,mode;
    try {
        conn = await db.getConnection();
       console.log(req.body)
        const {productno, name,description,purchaserate,salerate,productcategoryno,openingstock } = req.body;
        vproductno=productno
           if (vproductno===0 || vproductno===null || vproductno==="") {
                query="select nvl((select max(productno) from productmaster),0)+1 nextproductno";
                const [nextproductno]= await conn.query(query);
                vproductno=nextproductno[0].nextproductno
           } 
            query = 'INSERT INTO productmaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vproductno,name,description,purchaserate,salerate,productcategoryno,openingstock])
            res.status(201).json({ productno:vproductno, result: 'pass' });
    } catch (err) {
        console.log('Error whie creating product', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchProducts = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT productcategory.productcategoryname,product.* FROM productmaster product left join productcategorymaster productcategory on productcategory.productcategoryno=product.productcategoryno order by productno`;
        const [rows] = await conn.execute(query);
        console.log(rows)
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchProducts', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchProductById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const productno = req.params.productno;
        query = `SELECT * FROM productmaster WHERE productno=${productno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data );
    } catch (err) {
        console.log('Error whie fetchProductById', err);
        throw err;
    } finally {
        console.log('product DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateProductById = async (req, res) => {
    let conn;
    try {
        const {productno, name,description,purchaserate,salerate,productcategoryno,openingstock } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE productmaster SET name=?,description=?,purchaserate=?,salerate=?,productcategoryno=?,openingstock=?  WHERE productno=?';
        const [result] = await conn.execute(query,[name,description,purchaserate,salerate,productcategoryno,openingstock, productno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ result: 'pass' });
    } catch (err) {
        console.log('Error whie update ProductByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteProductById = async (req, res) => {
    let conn;
    try {
        const productno = req.params.productno;
        conn = await db.getConnection();
        query="delete from productmaster where productno=?"
        const [result]=await conn.execute(query,[productno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'Product Deleted' });
    } catch (err) {
        console.log('Error whie deleteProductById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

module.exports = {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProductById,
    deleteProductById
}