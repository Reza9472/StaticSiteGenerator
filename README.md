# StaticSiteGenerator

This is a Simple CLI tool based on nodejs for generating html files from our text files.

# Getting Started

* clone the repository

  ``` git clone https://github.com/Reza9472/StaticSiteGenerator.git ```
* Install dependencies
  
  ``` npm i ```

-------------

# Features

* Display version of the tool:
 
  ```reza-ssg --version```
* Display command instructions (help):

  ``` reza-ssg --help```
* Create an html file from a text or markdown file:

  ``` reza-ssg --index "Silver Blaze".txt ```
  ``` reza-ssg -i Silver.md ```

* Create html files from all the text or markdown files inside the 'text files' folder:

  ``` reza-ssg --index "text files" ```
* Add your options like input, output, stylesheet and lang to a JSON file and pass it to the program.

``` reza-ssg -c config1.json ```

# Unit Tests

* Run tests on the code to make sure the functions work

``` npm test ```
# Format the code

* Formatting the code using prettier:

 ``` npm run prettier ```

# Run the Linter

* Running the Linter on the project:

 ``` npm run eslint ```
# License
This project is licensed under the MIT license

# Author

Reza Poursafa
