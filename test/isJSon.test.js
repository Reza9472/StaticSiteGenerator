const index = require("../index");
const fs = require("fs");

test("isJSON function exists", () => {
  expect(typeof index.isJSON).toEqual("function");
});

test("Argument must be of type json", () => {
  expect(index.isJSON("config.json")).toBeTruthy();
  //   expect(index.isJSON(null)).toThrow(Error);
});

test("Argument must be of type json", () => {
  expect(index.isJSON("Silver.txt")).toBeFalsy();
  //   expect(index.isJSON(null)).toThrow(Error);
});

test("Passing JSON config file to program works", () => {
  index.parseJSON(JSON.parse(fs.readFileSync("./config1.json")));
  expect(fs.existsSync("dist1234")).toBeTruthy();
  expect(fs.existsSync("dist1234/Silver Blaze.html")).toBeTruthy();
  expect(fs.existsSync("dist1234/Silver Blaze.html")).toBeTruthy();
  expect(fs.existsSync("dist1234/The Naval Treaty.html")).toBeTruthy();
});

