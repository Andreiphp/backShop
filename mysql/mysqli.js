let mysqli = require('mysql');



class Mysql {
    constructor() {
        this.connection = mysqli.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "AngularShop"
        });
    }

    getAdmin(login, password, token, response) {
        this.connection.connect(function (err) {
            this.connection.query("SET SESSION wait_timeout = 604800");
            let sql = 'SELECT * FROM users WHERE login = ? AND password = ?';
            this.connection.query(sql, [login, password], function (err, result) {
                if (err) throw err;
                if (result.length > 0 && result[0]['isAdmin'] === 'true') {
                    response.json({token: token, user: result[0]['id'], password: result[0]['password']});
                } else {
                    response.json(err);
                }
            });
        }.bind(this));
    }
    countPages(response) {
        this.connection.connect(function (err) {
            this.connection.query("SET SESSION wait_timeout = 604800");
            let sql = 'SELECT COUNT(id) AS count FROM products';
            this.connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result)
               response.json(result)
            });
        }.bind(this));
    }
    
}

module.exports.DB = new Mysql();