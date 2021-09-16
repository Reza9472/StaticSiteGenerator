#! /usr/bin/env node

// const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { createInterface } = require('readline');
const { createReadStream } = require('fs');
const { once } = require('events');
const { program } = require('commander');
program.version('0.1');

program
  // .option('-d, --debug', 'output extra debugging')
  // .option('-s, --small', 'small pizza size')
  // .option('-p, --pizza-type <type>', 'flavour of pizza')
  .option('--index', 'Single txt file ')
  .option('-i, --folder', 'All text files from the "Text Files" folder ')

  // .option('-v, --version', 'Program Version ');

program.parse(process.argv);

const options = program.opts();
// if (options.debug) console.log(options);
// console.log('pizza details:');

// if (options.small) console.log('- small pizza size');
// if (options.version) console.log('Program Version: 0.1');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);



if(options.folder){
    // Node.js program to demonstrate the
  // fs.readFileSync() method
  
  
  
  // Function to get current filenames
  // in directory with specific extension
  files = fs.readdirSync(__dirname + '/text files');
  
  console.log("\Filenames with the .txt extension:");
  files.forEach(file => {
  
  
    if (path.extname(file) == ".txt"){
      const folderName = 'dir';
  
      const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
  
      filenameWithoutExt = path.parse(file).name;
  
    fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);  
      console.log(file)
      fs.readFile(file , {encoding:'utf8', flag:'r'},
      function(err, data) {
        if(err)
        console.log(err);
        else
        // console.log(data);
  
        var editedText = data
        .split(/\r?\n\r?\n/)
        .map(para =>
          `<p>${para.replace(/\r?\n/, ' ')}</p>`
        )
        .join(' ');

        console.log(editedText);

        // const rl = readline.createInterface({
        //   input: fs.createReadStream(data),
        //   crlfDelay: Infinity
        // });
        
        // rl.on('line', (line) => {
        //   console.log(`Line from file: ${line}`);
        // });

        // if(data !== ''){

        //   data = `<p>${data}</p>`
        //   console.log('space')
        // }
        // else
        //   data = '</p><br>'
        
        // console.log(filenameWithoutExt);
        fs.appendFile(`${process.cwd()}/${folderName}/${path.parse(file).name}.html` , editedText , function(err){
          if(err) throw err;
        })
  
  
      })
    }
  })
}


if(options.folde){

  // fs.readdir('./text files', function (err, files) {
  //   //handling error
  //   if (err) {
  //       return console.log('Unable to scan directory: ' + err);
  //   } 
  //   //listing all files using forEach
  //   files.forEach(function (file) {
  //       // Do whatever you want to do with the file
  //       // console.log(file); 
  //       const folderName = 'dir';

  //       const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
  //       // var filename = process.argv[3];
  
  //       filenameWithoutExt = path.parse(file).name;

  //       fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);

        
  //       (async function processLineByLine() {
  //         try {
  //           let rl = createInterface({
  //             input: createReadStream(file),
  //             crlfDelay: Infinity
  //           });

            
  //           // console.log(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html`);
  //           // let prep = '';
  //           rl.on('line', (line) => {
  
  //             if(line !== ''){
  
  //               var toPrepand = `<p style='text-align: center;'>`;
  //               // var toPrepand = `<p>${line}</p>`;
  //               toPrepand = toPrepand.concat(`${line}`);
  //               // prep = prep.concat(toPrepand);
               
                
  //             }else{
  //               var toPrepand = '</p><br>';
  //               // prep = prep.concat(toPrepand);
  //             }


  //             fs.appendFile(`${process.cwd()}/${folderName}/${file}.html` , toPrepand , function(err){
  //               if(err) throw err;
  //             })
  //             console.log(filenameWithoutExt);
  //           });
            
        
  //           await once(rl, 'close');
        
  //           console.log('File processed.');
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       })();






  //   });
  // });

  // function readFilesFromFolder(dirname, onFileContent, onError) {
  //   fs.readdir(dirname, function(err, filenames) {
  //     if (err) {
  //       onError(err);
  //       return;
  //     }
  //     filenames.forEach(function(filename) {
  //       fs.readFile(dirname + '\\' + filename, 'utf-8', function(err, content) {
  //         if (err) {
  //           onError(err);
  //           return;
  //         }
  //         onFileContent(filename, content);
  //       });
  //     });
  //   });
  // }

  // var data = {};
  // readFilesFromFolder('text files', function(filename, content) {
  //   data[filename] = content;
  // }, function(err) {
  //   throw err;
  // });

}


if(options.index){



  console.log(process.argv);


  // const yargs = require("yargs");

  program
      .command('list')
      .description('Add a text file to create a html file from the text')
      // .action(list)

  const folderName = 'dir';

  let file = fs.readFile(`${process.argv[3]}`, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    // console.log(data);
    // return data;
  })



  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err);
  }

  function createHtml(){

      const htmlFile = fs.readFileSync(`${__dirname}/index.html`)
      var filename = process.argv[3];

      filenameWithoutExt = path.parse(filename).name;

      console.log(process.argv[2]);
      console.log(filename);
      
      fs.writeFileSync(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , htmlFile);


      (async function processLineByLine() {
        try {
          const rl = createInterface({
            input: createReadStream(filename),
            crlfDelay: Infinity
          });
      
          rl.on('line', (line) => {

            if(line !== ''){

              var toPrepand = `<p>`;
              // var toPrepand = `<p>${line}</p>`;
              toPrepand = toPrepand.concat(`${line}`);
            }else{
              var toPrepand = '</p><br>';
            }

                // var result = data.replace(/\<\/body>/g, tond + '</body>');
            console.log(`Line from file: ${line}`);
            // Process the line.

            fs.appendFile(`${process.cwd()}/${folderName}/${filenameWithoutExt}.html` , toPrepand , function(err){
              if(err) throw err;
            })
          });
      
          await once(rl, 'close');
      
          console.log('File processed.');
        } catch (err) {
          console.error(err);
        }
      })();


}



createHtml();
}