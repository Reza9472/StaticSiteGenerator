#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { createReadStream } = require('fs');
const { once } = require('events');
const { program } = require('commander');


program.version( require('./package.json').version); // Getting the verison of the file
program
  .option('-i ,--index', 'Single txt file ') // option for adding a single text file
  .option('-c ,--config','JSON configuration file');

program.parse(process.argv);

const options = program.opts(); // The --index or -i options

try{ // checking the JSON file exist
  const config = require('./config.json');

  var data = {
    input: config.input ?? "./text files",
    output: config.output ?? "./dist"
  }

}catch(e){ // throw error message when JSON file does not exist
  if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
        console.log("Can't load JSON file!");
    else
        throw e;
}

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
    let status = fs.statSync(data.input);
    let fileStatus = status.isFile();

    if(fileStatus){
      generateHTMLFromFile(path.basename(data.input), data.output);
    }
    else
      generateHTMLFromDir(path.basename(data.input), data.output)
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
  fs.readFile(
    file,
    { encoding: "utf8", flag: "r" },
    function (err, data) {
      if (err) console.log(err);
      let title = removeMarkdownFormatting(data.split("\n")[0]);
      data = data.replace(title, ""); // removes the title from the text

      var editedText = data
        .split(/\r?\n\r?\n/)
        .map((para) => `<p style="font-family: 'Gentium Basic', serif; font-size: 20px; ">` + createHTMLFromMarkdown(para) + `</p>`)
        .join("\n");

      let titleInsidePTag = `<h1 style="text-align: center; background-color: black; color: white; width: 50%; border-radius: 10px; margin: auto; top: 15px; ">${title}</h1>`;
      
      // Appending the title
      fs.appendFile(
        `${process.cwd()}/${folderName}/${path.parse(file).name}.html`,
        titleInsidePTag,
        function (err) {
          if (err) throw err;
        }
      );

      // Appending the rest of the text
      fs.appendFile(
        `${process.cwd()}/${folderName}/${path.parse(file).name}.html`,
        editedText.replace(title, ""),
        function (err) {
          if (err) throw err;
        }
      );
    }
  );
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

function generateHTMLFromFile(input = process.argv[3], output="./dist"){
  const folderName = output; 
  console.log(input);
    // creating the dist folder if it doesn't exist

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err);
    }

    function createHTML(){
      var filename = input
      const htmlFile = fs.readFileSync(`${__dirname}/index.html`)

      filenameWithoutExt = path.parse(filename).name; // The name part of the file (EX: name.txt => name)

      fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html`, htmlFile);

      fs.readFile(filename, { encoding: 'utf8', flag: 'r' },
        function (err, data) {
          if (err)
            console.log(err);
          else

            var editedText = data // Editing the text to recieved from the files 
              .split(/\r?\n\r?\n/)
              .map(para =>
                `<p font-family: 'Gentium Basic', serif; font-size: 24px; padding: 10px; border-radius: 20px">${para.replace(/\r?\n/, ' ')}</p>`
              )
              .join(' ');


          let title = editedText.split("</p>")[0].split(">", 2)[1]; // getting the title of the text

          titleInsidePTag = `<h1 style="text-align: center; background-color: black; color: white; width: 50%; border-radius: 10px; margin: auto; top: 15px; ">${title}</h1>`

          // Appending the title
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(filename).name}.html`, titleInsidePTag, function (err) {
            if (err) throw err;
          })

          // Appending the rest of the text
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(filename).name}.html`, editedText.replace(title, ""), function (err) {
            if (err) throw err;
          })
        })


      } 
      let extension = path.extname(input);
      if (extension  === ".txt") {
        const directory = output;
        emptyDirectory(directory);
        createHTML();

        console.log("Operation Successful\nHTML file created");
      } else if (extension === ".md") {
        const directory = 'dist'
        emptyDirectory(directory);
        readMarkdownFile(input, output)
        console.log("Operation Successful\nHTML file created");
      }
}

function generateHTMLFromDir(input = process.argv[3], output = "dist"){
  const folderName = output; 

        // creating the dir folder if it doesn't exist
      
        try {
          if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName)
          }
        } catch (err) {
          console.error(err);
        }

        // If a FOLDER is passed (reza-ssg --folder "text files")
        
      // Function to get current filenames
      // in directory with specific extension
      files = fs.readdirSync(__dirname + "\\" + input);
      
      files.forEach(file => { // getting the files inside the folder
        
        if (path.extname(file) == ".txt"){ // Finding the text files
          //const folderName = 'dist';
      
          const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
      
          filenameWithoutExt = path.parse(file).name; // The name part of the file (EX: name.txt => name)
      
          fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);  
          
          fs.readFile(file , {encoding:'utf8', flag:'r'},
          function(err, data) {
            if(err)
            console.log(err);
            else

            var editedText = data // Editing the text to recieved from the files 
            .split(/\r?\n\r?\n/)
            .map(para =>
              `<p style="text-align: center; margin: 60px; font-family: 'Gentium Basic', serif; font-size: 24px; background-color: #fff2cc; padding: 10px; border-radius: 20px">${para.replace(/\r?\n/, ' ')}</p>`
            )
            .join(' ');
            

            let title = editedText.split("</p>")[0].split(">" , 2)[1]; // getting the title of the text

            titleInsidePTag = `<h1 style="text-align: center; background-color: black; color: white; width: 50%; height: 100%; border-radius: 10px; margin: auto; top: 15px; ">${title}</h1>`
            
            // Appending the title
            fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(file).name}.html` , titleInsidePTag , function(err){
              if(err) throw err;
            })

            // Appending the rest of the text
            fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(file).name}.html` , editedText.replace(title , "") , function(err){
              if(err) throw err;
            })
      
      
          })
        }else if (path.extname(file) == ".md") {
          const folderName = output;
  
          const htmlFile = fs.readFileSync(`${__dirname}/index.html`);
  
          filenameWithoutExt = path.parse(file).name; // The name part of the file (EX: name.txt => name)
  
          fs.writeFileSync(
            `${process.cwd()}/${folderName}/${filenameWithoutExt}.html`,
            htmlFile
          );
            
            readMarkdownFile(file, folderName)
        }
      })

          console.log('Files processed.');
          console.log('HTML Files created.');
}
// ----------------------------------------------------------------------------------------------------------

