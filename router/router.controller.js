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

<<<<<<< HEAD
routerController.get('/getBrands', (req, res) => {
    mysqli.DB.getBrands(res);
=======
routerController.get('/count_pages', (req, res) => {
    mysqli.DB.countPages(res);
>>>>>>> 08c90c8b3765a1a49d4e17914db09f3d4a7b8ef5
});


module.exports = routerController;