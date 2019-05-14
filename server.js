let express = require('express');
let app = express();
let expressJwt = require('express-jwt');
let fileUpload = require('express-fileupload');
let cors = require('cors');
let bodyParser = require('body-parser');
let route = require('./router/router.controller');
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

// app.use(expressJwt({secret: 'werty'}).unless({path: ['/router/authenticate']}));
app.use('/router', route);
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).send('invalid token...');
//     }
// });
app.listen(8080, function () {
    console.log('Server listening on port ');
});