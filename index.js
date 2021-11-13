#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const showdown = require("showdown");

program.version(require("./package.json").version); // Getting the verison of the file
program
  .option("-i ,--index", "Single txt file ") // option for adding a single text file
  .option("-c ,--config", "JSON configuration file")
  .option("--coverage , Testing with code coverage");

program.parse(process.argv);
const options = program.opts(); // The --index or -i options

if (options.index || options.config) {
  if (fs.existsSync(process.argv[3])) {
    let stats = fs.statSync(process.argv[3]); // Finding out if the file is a file or folder
    let isFile = stats.isFile();
    let isDir = stats.isDirectory();
    let isJson = isJSON(process.argv[3]); // check this is JSON file

    if (isFile && !isJson) {
      // if the passed value is a file
      generateHTMLFromFile(); // using default parameter
    } else if (isDir) {
      generateHTMLFromDir(); // using default parameter
    } else if (isJson) {
      let config = require(`./${process.argv[3]}`);
      parseJSON(config);
    }
  } else {
    throw new Error("File not found");
  }
}

function parseJSON(fileName) {
  try {
    // checking the JSON file exist

    const config = fileName;
    var data = {
      input: config.input ?? "./text files",
      outputFolder: config.output ?? "./dist",
    };
  } catch (e) {
    // throw error message when JSON file does not exist
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
      console.log("Can't load JSON file!");
    else throw e;
  }
  let status = fs.statSync(data.input);
  let fileStatus = status.isFile();

  if (fileStatus) {
    generateHTMLFromFile(path.basename(data.input), data.outputFolder);
  } else {
    generateHTMLFromDir(path.basename(data.input), data.outputFolder);
  }
}

function emptyDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

function isJSON(stats) {
  if (path.extname(stats) == ".json") return true;
  else return false;
}

function generateHTMLFromFile(
  input = process.argv[3],
  outputFolder = "./dist"
) {
  const folderName = outputFolder;

  try {
    if (fs.existsSync(input)) {
      // creating the dist folder if it doesn't exist
      createOutputFolder(folderName);

      let extension = path.extname(input);
      if (extension === ".txt") {
        const directory = outputFolder;
        emptyDirectory(directory);
        createHTML();

        console.log("Operation Successful\nHTML file created");
      } else if (extension === ".md") {
        const directory = "dist";
        emptyDirectory(directory);
        createHTML();
        console.log("Operation Successful\nHTML file created");
      }
    } else {
      throw new Error("File not found");
    }
  } catch (err) {
    // console.error(err);
    throw "File not found";
  }
  function createHTML() {
    var filename = input;
    appendTextInHTML(filename, folderName);
  }
}

function generateHTMLFromDir(input = process.argv[3], outputFolder = "dist") {

  if (fs.existsSync(input)) {
    const folderName = outputFolder;

    // creating the dir folder if it doesn't exist
    createOutputFolder(folderName);

    // If a FOLDER is passed (reza-ssg --folder "text files")

    // Function to get current filenames
    // in directory with specific extension
    let files = fs.readdirSync(__dirname + "/" + input);
    files.forEach((fileName) => {
      // getting the files inside the folder

      if (path.extname(fileName) == ".txt") {
        // Finding the text files

        appendTextInHTML(fileName, folderName);
      } else if (path.extname(fileName) == ".md") {
        const folderName = outputFolder;
        const htmlFile = fs.readFileSync(`${__dirname}/index.html`);
        let filenameWithoutExt = path.parse(fileName).name; // The name part of the fileName (EX: name.txt => name)

        fs.writeFileSync(
          `${process.cwd()}/${folderName}/${filenameWithoutExt}.html`,
          htmlFile
        );

        appendTextInHTML(fileName, folderName);
      }
    });

    successMsg();
  } else {
    throw Error("Folder not found");
  }
}

function appendTextInHTML(fileName, folderName) {
  let htmlFile = fs.readFileSync(`${__dirname}/index.html`);

  let filenameWithoutExt = path.parse(fileName).name; // The name part of the file (EX: name.txt => name)
  fs.writeFileSync(
    `${process.cwd()}/${folderName}/${filenameWithoutExt}.html`,
    htmlFile
  );
  readText(fileName, folderName, htmlFile);
}

function readText(fileName, folderName, htmlFile) {
  fs.readFile(fileName, { encoding: "utf8", flag: "r" }, function (err, data) {
    if (err) throw err;
    else htmlFile += new showdown.Converter().makeHtml(data);

    // Appending the rest of the text
    fs.appendFile(
      `${process.cwd()}/${folderName}/${path.parse(fileName).name}.html`,
      htmlFile,
      function (err) {
        if (err) throw err;
      }
    );
  });
}

function createOutputFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}

let isEmpty = true;
const dirIsEmpty = (folderName) => {
  fs.readdir(folderName, function (err, files) {
    if (err) {
      // some sort of error
      console.error(err);
      // throw err;
    } else {
      if (!files.length) {
        // directory appears to be empty
        isEmpty = true;
      } else {
        isEmpty = false;
      }
    }
  });

  return isEmpty;
};

function successMsg() {
  console.log("Files processed.");
  console.log("HTML Files created.");
}
// ----------------------------------------------------------------------------------------------------------

module.exports = {
  isJSON,
  createOutputFolder,
  readText,
  emptyDirectory,
  dirIsEmpty,
  generateHTMLFromFile,
  generateHTMLFromDir,
  parseJSON,
};