const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send({success: true})
});

app.listen(3000, () => console.log('Listening on port 3000'));

