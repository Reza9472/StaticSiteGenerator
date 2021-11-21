const index = require("../index");
const fs = require("fs");

test("createOutputFolder is a function", () => {
  expect(typeof index.createOutputFolder).toEqual("function");
});

beforeAll(() => {
  index.createOutputFolder("./folder1");
});

test("output folder is created successfully", () => {
  expect(fs.existsSync("folder1")).toBeTruthy();
});

afterAll(() => {
  fs.rmdirSync("./folder1");
});
