const { get, each, extend, reduce } = require("lodash");
exports.resolveInputs = async ({ components, inputs }) => {
  return components.map(component => {
    const propertyData = get(component, "propertyData", {});
    each(propertyData, (property, key) => {
      // see if inputs has the property or return property itself
      if (typeof property === "string" && property.charAt(0) === "@") {
        propertyData[key] = get(inputs, property.substr(1), property);
      }
    });
    try {
      return extend(component, { propertyData });
    } catch (e) {
      return component;
    }
  });
};

exports.resolveOutputs = async (graph, outputs) => {
  const resolved = {};
  each(outputs, (ports, componentId) => {
    resolved[componentId] = {};
    const component = graph.getComponent(componentId);
    if (!component) {
      return false;
    }
    each(ports, (properties, portId) => {
      resolved[componentId][portId] = {};
      const port = component.getPort(portId);
      if (!port) {
        return false;
      }
      resolved[componentId][portId] = reduce(
        properties,
        (acc, propertyId) => {
          acc[propertyId] = port.getProperty(propertyId).data;
          return acc;
        },
        {}
      );
    });
  });
  return resolved;
};
