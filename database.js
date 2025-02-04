const mysql = require('mysql2/promise');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: 'srv1824.hstgr.io',
                user: 'u310194916_jh',
                password: 'MYSQLPrem@1977',
                database: 'u310194916_jh'
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    async getConnection() {
        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error('Error getting connection from the pool:', error);
            throw error;
        }
    }
}

module.exports = new Database();

