const fs = require('fs');
const join = require('path').join;

function getJsonFiles(jsonPath){
  console.log(jsonPath)
  const jsonFiles = [];
  function findJsonFile(path) {
    const files = fs.readdirSync(path);
    files.forEach(function (item, index) {
        const fPath = join(path,item);
        const stat = fs.statSync(fPath);
        if(stat.isDirectory() === true) {
          findJsonFile(fPath);
        }
        if (stat.isFile() === true) { 
          jsonFiles.push(fPath.split(__dirname + '/templates/')[1]);
        }
    })
  }
  findJsonFile(jsonPath)
  return jsonFiles
}

const Generator = require('yeoman-generator')

module.exports = class Xsy extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'your project name',
        default: this.appname
      }
    ]).then(answers => {
      this.answers = answers
    })
  }
  write() {
    // this.fs.write(this.destinationPath('test.txt'), '123')
    const context = this.answers
    const files = getJsonFiles(join(__dirname, './templates'))
    files.forEach(item => {
      this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), context)
    })
  }
}