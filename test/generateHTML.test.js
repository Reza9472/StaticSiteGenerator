const index = require("../index");
const fs = require("fs");

test("HTML File from txt has been created", () => {
  index.generateHTMLFromFile("Silver Blaze.txt", "./dist");
  expect(fs.existsSync("dist/Silver Blaze.html")).toBeTruthy();
});

// test("HTML File from markdown has been created", () => {
//   index.generateHTMLFromFile("Silver.md", "./dist");
//   expect(fs.existsSync("dist/Silver.html")).toBeTruthy();
// });

test("HTML Files created from the txt files inside 'text files' folder", () => {
  index.generateHTMLFromDir("text files", "dist");
  expect(fs.existsSync("dist/Silver Blaze.html")).toBeTruthy();
  expect(fs.existsSync("dist/The Naval Treaty.html")).toBeTruthy();
});

test("Folder doesnt exist", () => {
  expect(() => {
    index.generateHTMLFromDir("myfile", "./dist");
  }).toThrowError("Folder not found");
});


test("File doesnt exist", () => {
  expect(() => {
    index.generateHTMLFromFile("Silvr Blaze.txt", "./dist");
  }).toThrowError("File not found");
});
