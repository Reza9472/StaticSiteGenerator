#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
// const readline = require('readline');
const { createInterface } = require('readline');
const { createReadStream } = require('fs');
const { once } = require('events');
const { program } = require('commander');
program.version('0.1');

program
 
  .option('-i ,--index', 'Single txt file ') // option for adding a single text file
  // .option('-i, --folder', 'All text files from the "Text Files" folder ') // option for adding a folder


program.parse(process.argv);

const options = program.opts(); // The --index or -i options

if(options.index){
  let stats = fs.statSync(process.argv[3]); // Finding out if the file is a file or folder

  let isFile = stats.isFile() 
  let isDir = stats.isDirectory()
  
  if (isFile) { // if the passed value is a file

    // console.log(process.argv[3]);

  const folderName = 'dir'; 


  // creating the dir folder if it doesn't exist

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err);
  }

  function createHtml(){

      const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
      var filename = process.argv[3]; // getting the filename

      filenameWithoutExt = path.parse(filename).name; // The name part of the filename without thwe extension
      
      fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);


      let counter = true; // for skipping the header 
      (async function processLineByLine() {
        try {
          const rl = createInterface({
            input: createReadStream(filename),
            crlfDelay: Infinity
          });
          
          let skipHeader = true; // for getting the header when we append it to the html
          rl.on('line', (line) => {

            if(counter === true){

              // console.log(line);
              let header = `<h1 style='text-align: center; background-color: black; color: white; width: 50%; height: 100%; border-radius: 10px; margin: auto;'>${line}</h1>`;


              fs.appendFile(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , header , function(err){
                if(err) throw err;
              })
            } 
            counter = false;


            if(line !== ''){

              var toPrepand = `<p style="text-align: center;  font-family: 'Gentium Basic', serif; font-size: 20px; ">`;
              
              toPrepand = toPrepand.concat(`${line}`);
            }else{
              var toPrepand = '</p><br>';
            }

            // Process the line.

            if(skipHeader === false){

              fs.appendFile(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , toPrepand , function(err){
                if(err) throw err;
              })
            }
            skipHeader = false;
          });
      
          await once(rl, 'close');
      
          console.log('File processed.');
          console.log('HTML File created.');
        } catch (err) {
          console.error(err);
        }
      })();

    }
    createHtml();
    
  } else if (isDir) {

    const folderName = 'dir'; 


    // creating the dir folder if it doesn't exist
  
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err);
    }

    // If a FOLDER is passed (reza-ssg --folder "text files")
    
  console.log(process.argv[3]);
  
  // Function to get current filenames
  // in directory with specific extension
  files = fs.readdirSync(__dirname + '/text files');
  // console.log(path.extname(process.argv[3]));
  
  
  files.forEach(file => { // getting the files inside the folder
    
    
    // console.log("\Filenames with the .txt extension:");
    if (path.extname(file) == ".txt"){ // Finding the text files
      const folderName = 'dir';
  
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
    }
  })

          console.log('Files processed.');
          console.log('HTML Files created.');
  }
 
}

// ----------------------------------------------------------------------------------------------------------

