const { get } = require("lodash");
exports.successJSON = {
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

exports.failJSON = {
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

exports.graphComponents = inputs => [
  {
    id: "start",
    graphComponentId: "start",
    executionType: "server",
    connections: [
      {
        fromPortId: "Start",
        toComponentId: "delay_1"
      }
    ],
    ports: [],
    propertyData: {}
  },
  {
    id: "delay_1",
    graphComponentId: "delay",
    executionType: "server",
    connections: [
      {
        fromPortId: "Success",
        toComponentId: get(
          inputs,
          "delay_1.toComponentId",
          "delay_1_success_log"
        )
      },
      {
        fromPortId: "Fail",
        toComponentId: get(inputs, "delay_1.toComponentId", "delay_1_fail_log")
      }
    ],
    ports: [],
    propertyData: {
      Resolve: get(inputs, "delay_1.Resolve", true),
      WaitTime: get(inputs, "delay_1.WaitTime", 2000)
    }
  },
  {
    id: "delay_2",
    graphComponentId: "delay",
    executionType: "server",
    connections: [
      {
        fromPortId: "Success",
        toComponentId: get(
          inputs,
          "delay_2.toComponentId",
          "delay_2_success_log"
        )
      },
      {
        fromPortId: "Fail",
        toComponentId: get(inputs, "delay_2.toComponentId", "delay_2_fail_log")
      }
    ],
    ports: [],
    propertyData: {
      Resolve: get(inputs, "delay_2.Resolve", true),
      WaitTime: get(inputs, "delay_2.WaitTime", 2000)
    }
  },
  {
    id: "delay_1_success_log",
    graphComponentId: "log",
    executionType: "server",
    connections: [],
    ports: [],
    propertyData: {
      Log: "delay_1_success_log text here"
    }
  },
  {
    id: "delay_1_fail_log",
    graphComponentId: "log",
    executionType: "server",
    connections: [],
    ports: [],
    propertyData: {
      Log: "delay_1_fail_log text here"
    }
  },
  {
    id: "delay_2_success_log",
    graphComponentId: "log",
    executionType: "server",
    connections: [],
    ports: [],
    propertyData: {
      Log: "delay_2_success_log text here"
    }
  },
  {
    id: "delay_2_fail_log",
    graphComponentId: "log",
    executionType: "server",
    connections: [],
    ports: [],
    propertyData: {
      Log: "delay_2_fail_log text here"
    }
  }
];
