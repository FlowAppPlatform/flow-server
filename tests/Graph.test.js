const DelayComponent = require("flow-delay-component");
const StartComponent = require("flow-start-component");
const LogComponent = require("flow-log-component");
const { Graph } = require("flow-platform-sdk");

const componentClasses = {
  delay: DelayComponent,
  start: StartComponent,
  log: LogComponent
};

const successJSON = {
  name: "graph",
  data: [
    {
      id: "start",
      graphComponentId: "start",
      ports: [],
      connections: [
        {
          fromPortId: "Start",
          toComponentId: "delay_1"
        }
      ]
    },
    {
      id: "delay_1",
      graphComponentId: "delay",
      connections: [
        {
          fromPortId: "Success",
          toComponentId: "log_1"
        },
        {
          fromPortId: "Fail",
          toComponentId: "log_1"
        }
      ],
      ports: [],
      propertyData: {
        Resolve: true,
        WaitTime: 2000
      }
    },
    {
      id: "log_1",
      graphComponentId: "log",
      propertyData: {
        Log: "@delay_1.Success.Message"
      },
      connections: []
    }
  ]
};

const failJSON = {
  name: "graph",
  data: [
    {
      id: "start",
      graphComponentId: "start",
      ports: [],
      connections: [
        {
          fromPortId: "Start",
          toComponentId: "delay_1"
        }
      ]
    },
    {
      id: "delay_1",
      graphComponentId: "delay",
      connections: [
        {
          fromPortId: "Success",
          toComponentId: "log_1"
        },
        {
          fromPortId: "Fail",
          toComponentId: "log_2"
        }
      ],
      ports: [],
      propertyData: {
        Resolve: false,
        WaitTime: 2000
      }
    },
    {
      id: "log_1",
      graphComponentId: "log",
      propertyData: {
        Log: "@delay_1.Success.Message"
      },
      connections: []
    },
    {
      id: "log_2",
      graphComponentId: "log",
      propertyData: {
        Log: "Failed"
      },
      connections: []
    }
  ]
};

it("should execute without errors", done => {
  const graph = new Graph("graph-1");
  graph.init(successJSON, componentClasses);
  graph.execute();

  graph.onComplete(() => {
    done();
  });
});

it("should end with correct component", done => {
  const graph = new Graph("graph-1");
  graph.init(successJSON, componentClasses);
  graph.execute();

  graph.onComplete(({ component }) => {
    expect(component.id).toEqual("log_1");
    done();
  });

  const graph2 = new Graph("graph-1");
  graph2.init(failJSON, componentClasses);
  graph2.execute();

  graph2.onComplete(({ component }) => {
    expect(component.id).toEqual("log_2");
    done();
  });
});
