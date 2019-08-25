let mysqli = require('mysql');
let helperSql = require('../helpers/helper-sql');

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
        let sql;
        if (category === 'all') {
            sql = 'SELECT COUNT(*) as count FROM' + ' ' + tableName;
        } else {
            sql = 'SELECT COUNT(*) as count FROM' + ' ' + tableName;
        }
        const promise = new Promise((resolve, reject) => {
            this.connection.connect(function (err) {
                this.connection.query("SET SESSION wait_timeout = 604800");

                this.connection.query(sql, (error, result) => {
                    if (error) reject(error);
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
    getAllProducts(category, offs, count, sort, toSort, response) {
        let flag = toSort === 'true' ? 'asc' : 'desc';
        this.connection.connect(function (err) {
            let sql = 'SELECT * FROM products WHERE cat_id = ? ORDER BY' + ` ${sort}  ${flag}` + ' LIMIT ' + offs + ',' + count;
            this.countFromBd(category, 'products').then(count => {
                this.connection.query(sql, [category, offs, count, sort, flag], (error, result) => {
                    if (error) throw err;
                    if (result.length) {
                        result.count = count
                        response.json({ res: result, count: count[0] });
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
    getBrands(response) {
        this.connection.connect(function (err) {
            this.connection.query("SET SESSION wait_timeout = 604800");
            let sql = `SELECT brands.id, brands.img, brands.title, COUNT(products.id) as count FROM brands LEFT JOIN 
            products ON brands.id = products.brand_id group BY brands.id`;
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
    getProductsByFilter({ brands, priceTo, priceFrom, offset, count, sort, toSort }, response) {
        let sql;
        let countSql;
        let sqlB = this.parseBrandsString(brands);
        if (sqlB) {
            sql = helperSql.Hsql.SqlQueryWidthBrands(sqlB, priceTo, priceFrom, offset, count, sort, toSort)
        } else {
            sql = helperSql.Hsql.SqlQueryWidthOutBrands(priceTo, priceFrom, offset, count, sort, toSort);
        }
        if (sqlB) {
            countSql = helperSql.Hsql.countWidthBrand(sqlB, priceTo, priceFrom);
        } else {
            countSql = helperSql.Hsql.countWidthOutBrand(priceTo, priceFrom);
        }
        this.getCount(countSql).then(count => {
            this.connection.connect(function (err) {
                this.connection.query("SET SESSION wait_timeout = 604800");

                this.connection.query(sql, [brands/* , priceTo, priceFrom, offset, count, sort, toSort */], (error, result) => {
                    if (error) throw error;
                    if (result) {
                        response.json({ res: result, count: count });
                    } else {
                        response.json(false);
                    }
                })
            }.bind(this));
        })

    }

    parseBrandsString(brands) {
        let sqlString = "";
        if (brands) {
            let h = brands.split(',');
            h.forEach((element, index) => {
                if (index === h.length - 1) {
                    sqlString += "'" + element + "'";
                } else {
                    sqlString += "'" + element + "',";
                }
    
            });
        }
        return sqlString;
    }
    getCount(sql) {
        const promise = new Promise((resolve, reject) => {
            this.connection.connect(function (err) {
                this.connection.query("SET SESSION wait_timeout = 604800");
                this.connection.query(sql, (error, result) => {
                    if (error) reject(error);
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
    getCountFilter() {

    }
    // products.price,
    // products.sale,
    // products.minidescription,
    // products.brand_id,
    // products.cat_id,


}

module.exports.DB = new Mysql();