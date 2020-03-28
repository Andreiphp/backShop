let express = require('express');
let routerController = express.Router();
let mysqli = require('../mysql/mysqli');
const jwt = require('jsonwebtoken');
const config = require('./../config.json');

routerController.post('/authenticate', function (req, res) {
    let login = req.body.login;
    let password = req.body.password;
    const token = jwt.sign({ sub: 1 }, config.secret, { expiresIn: 86400 });
    mysqli.DB.getAdmin(login, password, token, res);
});
routerController.get('/checkToken', function (req, res) {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            return res.status(200).send({ auth: true, message: 'all right!!!' });
        }
    });
});
routerController.get('/getAllProducts', (req, res) => {
    console.log(req.query);
    let offs = +req.query.offset;
    let count = +req.query.count;
    let category = req.query.category
    let sort = req.query.sort
    let toSort = req.query.toSort
    mysqli.DB.getAllProducts(category, --offs * count, count, sort, toSort, res);
});

routerController.get('/get_categories', (req, res) => {
    mysqli.DB.get_categories(res);
});

routerController.get('/getBrands', (req, res) => {
    mysqli.DB.getBrands(res);
});
routerController.get('/getProductsByFilter', (req, res) => {
    mysqli.DB.getProductsByFilter(req.query, res);
});
routerController.get('/collection', (req, res) => {
    mysqli.DB.collection(req.query, res);
});
routerController.get('/search', (req, res) => {
    console.log(req.query.search);
    const search = req.query.search;
    mysqli.DB.searchData(search, res);
})


module.exports = routerController;