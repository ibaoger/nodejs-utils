/**
 * convert a rfc txt file to markdown file.
 * usage:
 *   node app.js "input.txt" "output.md"
 *
 * 转换规则如下：
 * 1. 空行保留
 * 2. 行首为换页字符  时，更换为分隔线，长度不超过80
 * 3. 每一行开头的第一个字符为数字或英文字母(包括大写和小写)时，加粗此行
 * 4. 更换每一行中所有连续的两个半角空格为一个全角空格
 * 5. 检测每一行的内容是否包括 markdown 语法中需要转义的字符，添加转义
 * 6. 在每一行的末尾添加连续的两个半角空格
 */


function isEmptyLine (line) {

}

function isFormFeedLine (line) {

}

function isNumberOrEnglishLetterAtTheBeginOfLine (line) {

}

function replaceHalfsizeSpacesWithEmSpace (line) {

}

function replaceEscapeCharacter (line) {

}

function addHalfsizeSpaceAtTheEndOfLine (line) {

}

var readline = require('readline');
var fs = require('fs');
var readStream = fs.createReadStream('draft-pantos-http-live-streaming-04.txt');
readStream.on('readable', function() {
  console.log('readable');
});
readStream.on('end', function() {
  console.log('end');
});
readStream.on('data', function() {
  console.log('data');
});
readStream.on('error', function() {
  console.log('error');
});
readStream.on('close', function() {
  console.log('close');
});



var rl = readline.createInterface({
  input: readStream
});

rl.on('line', function (line) {
  console.log('line: '+line);
});

rl.on('pause', function() {
  console.log('Readline paused.');
});

rl.on('resume', function() {
  console.log('Readline resumed.');
});

rl.on('close', function() {
  console.log('Readline close.');
});

rl.on('SIGCONT', function() {
  // `prompt` will automatically resume the stream
  rl.prompt();
});

rl.on('SIGINT', function() {
  rl.question('Are you sure you want to exit?', function(answer) {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});

rl.on('SIGTSTP', function() {
  // This will override SIGTSTP and prevent the program from going to the
  // background.
  console.log('Caught SIGTSTP.');
});


