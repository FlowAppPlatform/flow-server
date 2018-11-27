const graphSchema = {
  name: "graph-1",
  data: [
    {
      id: "uniq-id",
      graphComponentId: "component-type",
      executionType: "server",
      properties: [
        {
          id: "property-id",
          type: "string"
        },
        {
          id: "property-id-2",
          type: "number"
        },
        {
          id: "property-id-3",
          type: "string"
        }
      ],
      propertyData: {
        // dynamic property
        "property-id": "@componentId.propertyId",
        "property-id-2": 5,
        // dynamic property
        "property-id-3": "@componentId.portId.propertyId"
      },

      // ports or results
      ports: [
        {
          id: "Success",
          properties: [
            {
              id: "port-property-id",
              type: "string"
            },
            {
              id: "port-property-id-2",
              type: "number"
            }
          ],
          propertyData: {
            "port-property-id-1": "port something",
            "port-property-id-2": 200
          }
        },
        {
          id: "Error",
          properties: [
            {
              id: "port-property-id",
              type: "string"
            },
            {
              id: "port-property-id-2",
              type: "number"
            }
          ],
          propertyData: {
            "port-property-id-1": "Error with sending email",
            "port-property-id-2": 200
          }
        }
      ],

      // outgoing connections
      connections: [
        {
          fromPortId: "Success",
          toComponentId: "next-component"
        },
        {
          fromPortId: "Error",
          toComponentId: "next-error-component"
        }
      ]
    }
  ]
};

const requestInputSchema = {
  inputs: {
    [componentId]: {
      [property_1]: "value_1",
      [property_2]: "value_2"
    }
  },
  components: ["component_1", "component_2"],
  startComponent: "component_1",
  outputs: {
    [componentId]: {
      [portId]: ["property_1", "property_2"]
    }
  }
};
