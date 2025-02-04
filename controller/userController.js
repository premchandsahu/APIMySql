const db = require("../database");

const createUser = async (req, res) => {
    let conn;
    var query,vuserno,mode;
    try {
        conn = await db.getConnection();
       
        const {userno ,username ,password ,email  } = req.body;
        vuserno=userno
           if (vuserno===0 || vuserno===null) {
                query="select nvl((select max(v) from usermaster),0)+1 nextuserno";
                const [nextuserno]= await conn.query(query);
                vuserno=nextuserno[0].nextuserno
           } 
            query = 'INSERT INTO usermaster values (?,?,?,?,?,?,?) '; 
            const [result] = await conn.execute(query, [vuserno,username ,password ,email ])
            res.status(201).json({ userno:vuserno, data: 'User '+ mode });
    } catch (err) {
        console.log('Error whie creating user', err);
        throw err;
    } finally {
        conn.release();
    }
}

const fetchUsers = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = `SELECT user.* FROM usermaster user`;
        const [rows] = await conn.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.log('Error whie fetchUsers', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const fetchUserById = async (req, res) => {
    let conn;
    try {
        var query;
        conn = await db.getConnection();
        const userno = req.params.userno;
        query = `SELECT * FROM usermaster WHERE userno=${userno}`;
        const [rows] = await conn.execute(query);
        var data = rows
        res.status(200).json( data[0] );
    } catch (err) {
        console.log('Error whie fetchUserById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

//Update method is not needed as of now. Insert and update operations have been handled inside post method.
const updateUserById = async (req, res) => {
    let conn;
    try {
        const {userno ,username ,password ,email   } = req.body;
        conn = await db.getConnection();
        const query =
            'UPDATE usermaster SET username ,password ,email WHERE userno=?';
        const [result] = await conn.execute(query,[username ,password ,email , userno]);
        console.log('Record Updated : ', result);
        res.status(200).json({ data: 'User Updated' });
    } catch (err) {
        console.log('Error whie update UserByID', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const deleteUserById = async (req, res) => {
    let conn;
    try {
        const userno = req.params.userno;
        conn = await db.getConnection();
        query="delete from usermaster where userno=?"
        const [result]=await conn.execute(query,[userno]);
        console.log('Rows affected:', result.affectedRows);
        res.status(200).json({ data: 'User Deleted' });
    } catch (err) {
        console.log('Error whie deleteUserById', err);
        throw err;
    } finally {
        console.log('DB conn released');
        conn.release();
    }
}

const validateUser = async (req, res) => {
    let conn,cntuser;
    try {
        conn = await db.getConnection();
       
        const {username ,password ,centerno  } = req.body;
        query="select count(*) cnt from usermaster where username=? and password=?";
                const [nextuserno]= await conn.query(query,[username,password]);
                cntuser=nextuserno[0].cnt
                if (cntuser===0){
                    res.status(201).json({ result:'fail' });
                } else {
                    res.status(201).json({ result:'pass' });
                }
    } catch (err) {
        console.log('Error whie creating user', err);
        throw err;
    } finally {
        conn.release();
    }
}



module.exports = {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUserById,
    validateUser
}