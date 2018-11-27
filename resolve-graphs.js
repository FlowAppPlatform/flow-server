const { get, each, extend } = require("lodash");
module.exports = async function resolveGraphs({ components, inputs }) {
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
