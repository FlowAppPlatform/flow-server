const Flow = require("flow-platform-sdk");
const graph = new Flow.Graph("text");

const TextComponent = require("flow-text-component");

describe("TextComponent test", () => {
  it("should replace when contains not", done => {
    const containComponent = new TextComponent.Contains();
    const containsReplaceComponent = new TextComponent.Replace();
    const doesNotContainReplaceComponent = new TextComponent.Replace();

    containComponent.getProperty("Text").data = "Something is not right here.";
    containComponent.getProperty("Contains").data = "not";

    containsReplaceComponent
      .getProperty("Text")
      .linkToProperty(containComponent.getProperty("Text"));
    containsReplaceComponent.getProperty("Replacement").data = "very";
    containsReplaceComponent.getProperty("Replace").data = /not/gi;

    doesNotContainReplaceComponent
      .getProperty("Text")
      .linkToProperty(containComponent.getProperty("Text"));
    doesNotContainReplaceComponent.getProperty("Replacement").data = "failed";
    doesNotContainReplaceComponent.getProperty("Replace").data = /right/gi;

    containComponent
      .getPort("Contains")
      .connectComponent(containsReplaceComponent);
    containComponent
      .getPort("DoesNotContain")
      .connectComponent(doesNotContainReplaceComponent);

    containsReplaceComponent.getPort("Done").onEmit(() => {
      const result = containsReplaceComponent
        .getPort("Done")
        .getProperty("Result").data;
      expect(result).toEqual("Something is very right here.");
      done();
    });

    doesNotContainReplaceComponent.getPort("Done").onEmit(() => {
      const result = doesNotContainReplaceComponent
        .getPort("Done")
        .getProperty("Result").data;
      expect(result).toEqual("Something is very right here.");
      done();
    });

    graph.addComponent(containComponent);
    graph.addComponent(containsReplaceComponent);
    graph.addComponent(doesNotContainReplaceComponent);

    containComponent.execute();
  });

  it("should replace right when does not contain not", done => {
    const containComponent = new TextComponent.Contains();
    const containsReplaceComponent = new TextComponent.Replace();
    const doesNotContainReplaceComponent = new TextComponent.Replace();

    containComponent.getProperty("Text").data = "Something is right here.";
    containComponent.getProperty("Contains").data = "not";

    containsReplaceComponent
      .getProperty("Text")
      .linkToProperty(containComponent.getProperty("Text"));
    containsReplaceComponent.getProperty("Replacement").data = "very";
    containsReplaceComponent.getProperty("Replace").data = /not/gi;

    doesNotContainReplaceComponent
      .getProperty("Text")
      .linkToProperty(containComponent.getProperty("Text"));
    doesNotContainReplaceComponent.getProperty("Replacement").data = "wrong";
    doesNotContainReplaceComponent.getProperty("Replace").data = /right/gi;

    containComponent
      .getPort("Contains")
      .connectComponent(containsReplaceComponent);
    containComponent
      .getPort("DoesNotContain")
      .connectComponent(doesNotContainReplaceComponent);

    containsReplaceComponent.getPort("Done").onEmit(() => {
      const result = containsReplaceComponent
        .getPort("Done")
        .getProperty("Result").data;
      expect(result).toEqual("Something is very right here.");
      done();
    });

    doesNotContainReplaceComponent.getPort("Done").onEmit(() => {
      const result = doesNotContainReplaceComponent
        .getPort("Done")
        .getProperty("Result").data;
      expect(result).toEqual("Something is wrong here.");
      done();
    });

    graph.addComponent(containComponent);
    graph.addComponent(containsReplaceComponent);
    graph.addComponent(doesNotContainReplaceComponent);

    containComponent.execute();
  });
});
