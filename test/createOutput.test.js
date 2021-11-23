const index = require("../index");
const fs = require("fs");

test("createOutputFolder function exists", () => {
  expect(typeof index.createOutputFolder).toEqual("function");
});

test("folder is getting created", () => {
  index.createOutputFolder("testFolder");
  expect(fs.existsSync("testFolder")).toBeTruthy();
});
