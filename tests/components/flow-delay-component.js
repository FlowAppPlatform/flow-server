const { Component, Property, Port, Graph } = require("flow-platform-sdk");

class DelayComponent extends Component {
  constructor(id) {
    super(id);
    this.name = "Delay Component";

    // properties
    const waitTimeProperty = new Property("WaitTime", "number");
    const resolveProperty = new Property("Resolve", "boolean");

    this.addProperty(waitTimeProperty);
    this.addProperty(resolveProperty);

    // ports
    const successPort = new Port("Success");
    const messageProperty = new Property("Message", "string");
    successPort.addProperty(messageProperty);

    const failPort = new Port("Fail");
    const errorProperty = new Property("Error", "string");
    failPort.addProperty(errorProperty);

    this.addPort(successPort);
    this.addPort(failPort);

    // actual task
    this.attachTask(() => {
      const waitTime = this.getProperty("WaitTime").data;
      setTimeout(() => {
        if (this.getProperty("Resolve").data) {
          this.getPort("Success").getProperty("Message").data =
            "Successful so far";
          this.getPort("Success").emit();
        } else {
          this.getPort("Fail").getProperty("Error").data = "Error unfortunate";
          this.getPort("Fail").emit();
        }
        this.taskComplete();
      }, waitTime);
    });
  }
}

module.exports = DelayComponent;
