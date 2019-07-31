let mysqli = require('mysql');

class Mysql {
    constructor() {
        this.connection = mysqli.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "shop"
        });
    }

    getAdmin(login, password, token, response) {
        this.connection.connect(function (err) {
            this.connection.query("SET SESSION wait_timeout = 604800");
            let sql = 'SELECT * FROM users WHERE login = ? AND password = ?';
            this.connection.query(sql, [login, password], function (err, result) {
                if (err) throw err;
                if (result.length && result[0]['isAdmin'] === 'true') {
                    response.json({ token: token, user: result[0]['id'], password: result[0]['password'] });
                } else {
                    response.json(err);
                }
            });
        }.bind(this));
    }
    countFromBd(category, tableName) {
        console.log(category);
        
        let sql;
        if (category === 'all') {
            sql = 'SELECT COUNT(*) as count FROM' + ' ' + tableName;
        }   else {
            sql = 'SELECT COUNT(*) as count FROM' + ' ' + tableName;
        }
        const promise = new Promise((resolve, reject) => {
             this.connection.connect(function (err) { 
            this.connection.query("SET SESSION wait_timeout = 604800");
           
            this.connection.query(sql, (error, result) => {
                if (error)  reject(error);
                if (result) {
                    resolve(result);
                } else {
                    reject(false);
                }
            })
        }.bind(this));
        })
       return promise;
    }
    getAllProducts(category, offs, count, response) {
        this.connection.connect(function (err) { 
            let sql = 'SELECT * FROM products WHERE cat_id = ?  LIMIT ' + offs + ',' + count;
            this.countFromBd(category, 'products').then(count => {
                this.connection.query(sql, [category, offs, count], (error, result) => {
                    if (error) throw err;
                    if (result.length) {
                        result.count = count
                        response.json({res: result, count: count[0]});
                    } else {
                        response.json(false);
                    }
                })
            }).catch(er => {
                console.log(er);
                
            });
           
        }.bind(this));
    }

    get_categories(response) {
        this.connection.connect(function (err) {
            this.connection.query("SET SESSION wait_timeout = 604800");
           let sql = 'SELECT * FROM categpries';
            this.connection.query(sql, (error, result) => {
                if (error) throw error;
                if (result) {
                    response.json(result);
                } else {
                    response.json(false);
                }
            })
        }.bind(this));
    }



}

module.exports.DB = new Mysql();