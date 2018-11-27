const request = require("supertest");
const { Graph } = require("flow-platform-sdk");
const { get } = require("lodash");

const DelayComponent = require("./components/flow-delay-component");
const LogComponent = require("./components/flow-log-component");
const StartComponent = require("flow-start-component");

const app = require("./../app");
const cloudboost = require("./../cloudboost");

const { successJSON, failJSON, graphComponents } = require("./stubs");

const componentClasses = {
  delay: DelayComponent,
  start: StartComponent,
  log: LogComponent
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

it("should work with a POST request", async () => {
  require("./../components").log = componentClasses.log;
  require("./../components").delay = componentClasses.delay;
  const requestInput = {
    inputs: {
      text_box_1: {
        value: 2000
      }
    },
    outputs: {},
    components: [
      "delay_1",
      "delay_2",
      "delay_1_success_log",
      "delay_1_fail_log",
      "delay_2_success_log",
      "delay_2_fail_log"
    ],
    startComponent: "delay_1"
  };
  cloudboost.fetchGraphComponents = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve(graphComponents()));

  const response = await request(app)
    .post("/")
    .accept("application/json")
    .send(requestInput);

  expect(response).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("lastComponentId");
  expect(response.body).toHaveProperty("lastPortName");
  expect(response.body.lastComponentId).toBe("delay_1_success_log");
});

it("should work with a different inputs", async () => {
  require("./../components").log = componentClasses.log;
  require("./../components").delay = componentClasses.delay;
  const requestInput = {
    inputs: {
      text_box_1: {
        value: 2000
      }
    },
    outputs: {},
    components: [
      "delay_1",
      "delay_2",
      "delay_1_success_log",
      "delay_1_fail_log",
      "delay_2_success_log",
      "delay_2_fail_log"
    ],
    startComponent: "delay_1"
  };
  cloudboost.fetchGraphComponents = jest.fn().mockReturnValueOnce(
    Promise.resolve(
      graphComponents({
        delay_1: {
          Resolve: false
        }
      })
    )
  );

  const response = await request(app)
    .post("/")
    .accept("application/json")
    .send(requestInput);

  expect(response).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("lastComponentId");
  expect(response.body).toHaveProperty("lastPortName");
  expect(response.body.lastComponentId).toBe("delay_1_fail_log");
});

it("should work with a change to delay_2", async () => {
  require("./../components").log = componentClasses.log;
  require("./../components").delay = componentClasses.delay;
  const requestInput = {
    inputs: {
      text_box_1: {
        value: 2000
      }
    },
    outputs: {},
    components: [
      "delay_1",
      "delay_2",
      "delay_1_success_log",
      "delay_1_fail_log",
      "delay_2_success_log",
      "delay_2_fail_log"
    ],
    startComponent: "delay_1"
  };
  cloudboost.fetchGraphComponents = jest.fn().mockReturnValueOnce(
    Promise.resolve(
      graphComponents({
        delay_1: {
          Resolve: false,
          toComponentId: "delay_2_success_log"
        }
      })
    )
  );

  const response = await request(app)
    .post("/")
    .accept("application/json")
    .send(requestInput);

  expect(response).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("lastComponentId");
  expect(response.body).toHaveProperty("lastPortName");
  expect(response.body.lastComponentId).toBe("delay_2_success_log");
});

it("should work with dyamic property data", async () => {
  require("./../components").log = componentClasses.log;
  require("./../components").delay = componentClasses.delay;
  const requestInput = {
    inputs: {
      text_box_1: {
        value: 4000
      }
    },
    outputs: {},
    components: [
      "delay_1",
      "delay_2",
      "delay_1_success_log",
      "delay_1_fail_log",
      "delay_2_success_log",
      "delay_2_fail_log"
    ],
    startComponent: "delay_1"
  };
  cloudboost.fetchGraphComponents = jest.fn().mockReturnValueOnce(
    Promise.resolve(
      graphComponents({
        delay_1: {
          Resolve: true,
          WaitTime: "@text_box_1.value"
        }
      })
    )
  );

  const response = await request(app)
    .post("/")
    .accept("application/json")
    .send(requestInput);

  expect(response).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("lastComponentId");
  expect(response.body).toHaveProperty("lastPortName");
  expect(response.body.lastComponentId).toBe("delay_1_success_log");
});

it("should get correct outputs", async () => {
  require("./../components").log = componentClasses.log;
  require("./../components").delay = componentClasses.delay;
  const requestInput = {
    inputs: {
      text_box_1: {
        value: 4000
      }
    },
    outputs: {
      delay_1: {
        Success: ["Message"]
      }
    },
    components: [
      "delay_1",
      "delay_2",
      "delay_1_success_log",
      "delay_1_fail_log",
      "delay_2_success_log",
      "delay_2_fail_log"
    ],
    startComponent: "delay_1"
  };
  cloudboost.fetchGraphComponents = jest.fn().mockReturnValueOnce(
    Promise.resolve(
      graphComponents({
        delay_1: {
          Resolve: true,
          WaitTime: "@text_box_1.value"
        }
      })
    )
  );

  const response = await request(app)
    .post("/")
    .accept("application/json")
    .send(requestInput);

  expect(response).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("outputs");
  expect(get(response.body, "outputs.delay_1.Success.Message")).toBeDefined();
});
