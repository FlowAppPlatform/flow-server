const db = [
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
        toComponentId: "delay_1_log_success"
      },
      {
        fromPortId: "Fail",
        toComponentId: "delay_1_log_fail"
      }
    ],
    ports: [],
    propertyData: {
      Resolve: true,
      WaitTime: "@text_box_1.value"
    }
  },
  {
    id: "delay_2",
    graphComponentId: "delay",
    executionType: "server",
    connections: [
      {
        fromPortId: "Success",
        toComponentId: "delay_2_log_success"
      },
      {
        fromPortId: "Fail",
        toComponentId: "delay_2_log_fail"
      }
    ],
    ports: [],
    propertyData: {
      Resolve: true,
      WaitTime: 2000
    }
  }
];
exports.fetchGraphComponents = async (appId, componentIds) => {
  return componentIds.map(componentId =>
    db.find(dbComponent => dbComponent.id === componentId)
  );
};
