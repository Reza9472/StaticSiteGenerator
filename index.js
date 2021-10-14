#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');


program.version( require('./package.json').version); // Getting the verison of the file
program
  .option('-i ,--index', 'Single txt file ') // option for adding a single text file
  .option('-c ,--config','JSON configuration file');

program.parse(process.argv);
const options = program.opts(); // The --index or -i options



if(options.index || options.config){

  let stats = fs.statSync(process.argv[3]); // Finding out if the file is a file or folder 
  let isFile = stats.isFile() 
  let isDir = stats.isDirectory()
  let isJson = isJSON(process.argv[3]) // check this is JSON file

  if (isFile && !isJson) { // if the passed value is a file
    generateHTMLFromFile() // using default parameter 
  } else if (isDir) {
    generateHTMLFromDir() // using default parameter 
  } else if(isJson){
    
  try{ // checking the JSON file exist
    const config = require(`./${process.argv[3]}`);
    
    var data = {
      input: config.input ?? "./text files",
      outputFolder: config.outputFolder ?? "./dist"
    }
    
  }catch(e){ // throw error message when JSON file does not exist
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
          console.log("Can't load JSON file!");
      else
          throw e;
  }

  let status = fs.statSync(data.input);
  let fileStatus = status.isFile();

  if(fileStatus){
      generateHTMLFromFile(path.basename(data.input), data.outputFolder);
  }
  else{
      generateHTMLFromDir(path.basename(data.input), data.outputFolder)
    }
  }
 
}

function createHTMLFromMarkdown(para) {
  let p =  para
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^--- (.*$)/gim, "<hr/>")
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
		.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
		.replace(/\*(.*)\*/gim, '<i>$1</i>')
		.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
		.replace(/\n$/gim, '<br /><br />')
    .replace(/^( ?[-_*]){3,} ?[\t]*$/ , '<hr>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

    return `<p style=" font-family: 'Gentium Basic', serif; font-size: 24px; padding: 10px; border-radius: 20px">${p}</p>`;
}

function removeMarkdownFormatting(text){
  return text
		.replace(/^### (.*$)/gim, '$1')
		.replace(/^## (.*$)/gim, '$1')
		.replace(/^# (.*$)/gim, '$1')
		.replace(/^\> (.*$)/gim, '$1')
		.replace(/\*\*(.*)\*\*/gim, '$1')
		.replace(/\*(.*)\*/gim, '$1')
		.replace(/\n$/gim, '$1')
}

function readMarkdownFile(file, folderName) {
  readText(file , folderName , true);
}

function styleText(para){
  return para.replace(/\r?\n/, ' ');
}

function emptyDirectory(directory){
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

function isJSON(stats){
  if(path.extname(stats) == ".json") 
    return true
  else 
    return false
}




function generateHTMLFromFile(input = process.argv[3], outputFolder="./dist"){
  const folderName = outputFolder; 
    // creating the dist folder if it doesn't exist

    createOutputFolder(folderName)

    function createHTML(){
      var filename = input

      appendTextInHTML(filename , folderName);
      
      } 
      let extension = path.extname(input);
      if (extension  === ".txt") {
        const directory = outputFolder;
        emptyDirectory(directory);
        createHTML();

        console.log("Operation Successful\nHTML file created");
      } else if (extension === ".md") {
        const directory = 'dist'
        emptyDirectory(directory);
        readMarkdownFile(input, outputFolder)
        console.log("Operation Successful\nHTML file created");
      }
}

function generateHTMLFromDir(input = process.argv[3], outputFolder = "dist"){
  const folderName = outputFolder; 

  // creating the dir folder if it doesn't exist
  createOutputFolder(folderName);

  // If a FOLDER is passed (reza-ssg --folder "text files")
        
  // Function to get current filenames
  // in directory with specific extension
  files = fs.readdirSync(__dirname + "/" + input);
  files.forEach(fileName => { // getting the files inside the folder
        
    if (path.extname(fileName) == ".txt"){ // Finding the text files
      
      appendTextInHTML(fileName , folderName);
      
    }else if (path.extname(fileName) == ".md") {
      const folderName = outputFolder;
      const htmlFile = fs.readFileSync(`${__dirname}/index.html`);
      filenameWithoutExt = path.parse(fileName).name; // The name part of the fileName (EX: name.txt => name)
  
      fs.writeFileSync(
       `${process.cwd()}/${folderName}/${filenameWithoutExt}.html`, htmlFile
      );
            
      readMarkdownFile(fileName, folderName)
    }
  })

  successMsg();
}

function appendTextInHTML(fileName , folderName){
  const htmlFile = fs.readFileSync(`${__dirname}/index.html`)

      filenameWithoutExt = path.parse(fileName).name; // The name part of the file (EX: name.txt => name)
      fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html`, htmlFile);
      readText(fileName , folderName)
}

function readText(fileName , folderName , isMdFile = false){
  fs.readFile(fileName, { encoding: 'utf8', flag: 'r' },
        function (err, data) {
          if (err)
            console.log(err);
          else

          if(isMdFile === true){

            var editedText = data // Editing the text to recieved from the files 
            .split(/\r?\n\r?\n/)
            .map(para =>
              `<p font-family: 'Gentium Basic', serif; font-size: 24px; padding: 10px; border-radius: 20px">${createHTMLFromMarkdown(para)}</p>`
              )
              .join(' ');
          }else{
            var editedText = data // Editing the text to recieved from the files 
            .split(/\r?\n\r?\n/)
            .map(para =>
              `<p font-family: 'Gentium Basic', serif; font-size: 24px; padding: 10px; border-radius: 20px">${styleText(para)}</p>`
              )
              .join(' ');
          } 

          if(isMdFile === false){

            var title = editedText.split("</p>")[0].split(">", 2)[1]; // getting the title of the text
          }else {
            var title = removeMarkdownFormatting(data.split("\n")[0]);
          }

          titleInsidePTag = `<h1 style="text-align: center; background-color: black; color: white; width: 50%; border-radius: 10px; margin: auto; top: 15px; ">${title}</h1>`

          // Appending the title
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(fileName).name}.html`, titleInsidePTag, function (err) {
            if (err) throw err;
          })

          // Appending the rest of the text
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(fileName).name}.html`, editedText.replace(title, ""), function (err) {
            if (err) throw err;
          })
        })
}


function createOutputFolder(folderName){
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err);
  }
}


function successMsg(){
  console.log('Files processed.');
  console.log('HTML Files created.');
}
// ----------------------------------------------------------------------------------------------------------

