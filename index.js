const flow = require('flow-platform-sdk');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({success: true});
});

app.post('/', (req, res) => {

  let graph = new flow.Graph('Graph');
  graph.init(req.body.graphs, req.body.componentClasses);

  graph.execute();

  res.send({success: true});

});

app.listen(3000, () => console.log('Listening on port 3000'));