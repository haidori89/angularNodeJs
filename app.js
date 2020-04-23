const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http').Server(app);
const port = 3000;
const chalk = require('chalk');
const cors = require('cors');

app.use(express.json());

app.use(cors());
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-type,Accept');
    next();
});

mongoose.connect("mongodb://localhost/rest_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).
then(res =>
    console.log(chalk.black.bgGreenBright("connected success"))
).
catch(err =>
    console.log(err)
)


app.use('/api/users', users);
app.use('/api/auth', auth);

http.listen(port, () => {
    console.log(`running on port ${port}...`);
})
