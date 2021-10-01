#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { createReadStream } = require('fs');
const { once } = require('events');
const { program } = require('commander');


program.version( require('./package.json').version); // Getting the verison of the file
program.option('-i ,--index', 'Single txt file ') // option for adding a single text file


program.parse(process.argv);

const options = program.opts(); // The --index or -i options

if(options.index){
  let stats = fs.statSync(process.argv[3]); // Finding out if the file is a file or folder

  let isFile = stats.isFile() 
  let isDir = stats.isDirectory()
  
  if (isFile) { // if the passed value is a file

    const folderName = 'dist'; 

    // creating the dist folder if it doesn't exist

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err);
    }

    function createHTML(){

      
      var filename = process.argv[3]
      const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
      
      filenameWithoutExt = path.parse(filename).name; // The name part of the file (EX: name.txt => name)
      
      fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);  
      
      fs.readFile(filename , {encoding:'utf8', flag:'r'},
      function(err, data) {
        if(err)
        console.log(err);
        else
        
        var editedText = data // Editing the text to recieved from the files 
        .split(/\r?\n\r?\n/)
        .map(para =>
          `<p font-family: 'Gentium Basic', serif; font-size: 24px; padding: 10px; border-radius: 20px">${para.replace(/\r?\n/, ' ')}</p>`
          )
          .join(' ');
          
          
          let title = editedText.split("</p>")[0].split(">" , 2)[1]; // getting the title of the text
          
          titleInsidePTag = `<h1 style="text-align: center; background-color: black; color: white; width: 50%; border-radius: 10px; margin: auto; top: 15px; ">${title}</h1>`
          
          // Appending the title
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(filename).name}.html` , titleInsidePTag , function(err){
            if(err) throw err;
          })
          
          // Appending the rest of the text
          fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(filename).name}.html` , editedText.replace(title , "") , function(err){
            if(err) throw err;
          })
        })
        
      }
        
        
    // function createHtml(){

    //     const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
    //     var filename = process.argv[3]; // getting the filename

    //     filenameWithoutExt = path.parse(filename).name; // The name part of the filename without thwe extension
        
    //     fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);


    //     let counter = true; // for skipping the header 
    //     (async function processLineByLine() {
    //       try {
    //         const rl = createInterface({
    //           input: createReadStream(filename),
    //           crlfDelay: Infinity
    //         });
            
    //         let skipHeader = true; // for getting the header when we append it to the html
    //         rl.on('line', (line) => {

    //           if(counter === true){

    //             let header = `<h1 style='text-align: center; background-color: black; color: white; width: 50%; height: 100%; border-radius: 10px; margin: auto;'>${line}</h1>`;

    //             fs.appendFile(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , header , function(err){
    //               if(err) throw err;
    //             })
    //           } 
    //           counter = false;


    //           if(line !== ''){

    //             var toPrepand = `<p style="text-align: center;  font-family: 'Gentium Basic', serif; font-size: 20px; ">`;
                
    //             toPrepand = toPrepand.concat(`${line}`);
    //           }else{
    //             var toPrepand = '</p><br>';
    //           }

    //           // Process the line.

    //           if(skipHeader === false){

    //             fs.appendFile(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , toPrepand , function(err){
    //               if(err) throw err;
    //             })
    //           }
    //           skipHeader = false;
    //         });
        
    //         await once(rl, 'close');
        
    //         console.log('File processed.');
    //         console.log('HTML File created.');
    //       } catch (err) {
    //         console.error(err);
    //       }
    //     })();


      let extension = path.extname(process.argv[3]);
      if (extension  === ".txt") {
        const directory = 'dist';
        emptyDirectory(directory);
        // readMarkdownFile(process.argv[3], "dist")
        
        createHTML();
      } else if (extension === ".md") {
        const directory = 'dist'
        emptyDirectory(directory);
        readMarkdownFile(process.argv[3], "dist")
      }
    
  } else if (isDir) {

        const folderName = 'dist'; 


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
      
      files.forEach(file => { // getting the files inside the folder
        
        if (path.extname(file) == ".txt"){ // Finding the text files
          const folderName = 'dist';
      
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
          const folderName = "dist";
  
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
		.replace(/\n$/gim, '<br /><br />');

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



// ----------------------------------------------------------------------------------------------------------

