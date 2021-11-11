const index = require("../index");

// empty directory is a function
test("emptyDirectory function works", () => {
  expect(typeof index.emptyDirectory).toEqual("function");
});

beforeAll(() => {
  index.emptyDirectory("dist");
});

test("Directory should be empty", () => {
  expect(index.dirIsEmpty("dist")).toBeTruthy();
});
