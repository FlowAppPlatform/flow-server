const { Component, Property, Port, Graph } = require("flow-platform-sdk");

class LogComponent extends Component {
  constructor(id) {
    super(id);
    this.name = "Log Component";

    // properties
    const logProperty = new Property("Log", "string");
    this.addProperty(logProperty);

    // ports
    const successPort = new Port("Success");
    const messageProperty = new Property("Message", "string");
    successPort.addProperty(messageProperty);

    this.addPort(successPort);

    // actual task
    this.attachTask(() => {
      const logText = this.getProperty("Log").data;
      console.log(logText);

      //emit success ports
      this.getPort("Success").getProperty("Message").data =
        "Logged successfully";
      this.getPort("Success").emit();

      // complete!
      this.taskComplete();
    });
  }
}

module.exports = LogComponent;
