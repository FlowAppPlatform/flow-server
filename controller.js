const { Graph } = require("flow-platform-sdk");
const { get } = require("lodash");
const componentClasses = require("./components");
const resolveGraphs = require("./resolve-graphs");
const api = require("./cloudboost");

module.exports = (req, res, next) => {
  // TODO: validate request data
  const { components, inputs, outputs, appId } = req.body;

  executeGraphs(req.body)
    .then(result => {
      res.json({
        componentId: get(result, "component.id"),
        portName: get(result, "port.name")
      });
    })
    .catch(next);
};

function executeGraphs({ components, inputs, outputs, startComponent, appId }) {
  return new Promise((resolve, reject) => {
    api
      // IDs to Graph Components
      .fetchGraphComponents(appId, components)
      // resolve dynamic properties
      .then(graphs => {
        return resolveGraphs({ components: graphs, inputs });
      })
      .then(graphs => {
        const graph = new Graph("Graph");
        graph.init(
          {
            data: [getStartComponent(startComponent), ...graphs],
            name: "Graph"
          },
          componentClasses
        );
        graph.execute();
        graph.onComplete(resolve);
      })
      .catch(reject);
  });
}

function getStartComponent(startComponent) {
  return {
    id: "start",
    graphComponentId: "start",
    connections: [
      {
        fromPortId: "Start",
        toComponentId: startComponent
      }
    ]
  };
}
