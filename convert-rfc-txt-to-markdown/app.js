/**
 * convert a rfc txt file to markdown file.
 * usage:
 *   node app.js "input.txt" "output.md"
 *
 * 转换规则如下：
 * 1. 更换每一行中所有连续的两个半角空格为一个全角空格
 * 2. 检测每一行的内容是否包含 markdown 语法中需要转义的字符，添加转义
 * 3. 检测每一行的内容是否包含 html 语法中需要转义的字符，添加转义
 * 4. 行首为换页字符  时，更换为分隔线，长度不超过80
 * 5. 每一行开头的第一个字符为数字或英文字母(包括大写和小写)时，加粗此行
 * 6. 空行更换为一个全角空格
 * 7. 在每一行的末尾添加连续的两个半角空格
 */

var readline = require('readline');
var fs = require('fs');
var conv = require('binstring');
var filename = 'draft-pantos-http-live-streaming-04';
var rfc_txt = filename + '.txt';
var rfc_md = filename + '.md';

function start() {
    console.log('input file: ' + rfc_txt);
    if (fs.existsSync(rfc_md)) {
        fs.unlinkSync(rfc_md);
    }
    var readStream = fs.createReadStream(rfc_txt);
    // readStream.on('readable', function() {
    //     console.log('readable');
    // });
    // readStream.on('end', function() {
    //     console.log('end');
    // });
    // readStream.on('data', function() {
    // console.log('data');
    // });
    readStream.on('error', function() {
        console.log('error');
        if (fs.existsSync(rfc_md)) {
            fs.unlinkSync(rfc_md);
        }
    });
    readStream.on('close', function() {
        // console.log('close');
        if (fs.existsSync(rfc_md)) {
            console.log('convert success.');
            console.log('output file: ' + rfc_md);
        } else
            console.log('convert failed.');
    });


    var rl = readline.createInterface({
        input: readStream
    });

    rl.on('line', function(line) {
        line = replaceHalfsizeSpacesWithEmSpace(line);
        line = replaceEscapeCharacter(line);
        if (isFormFeedLine(line)) {
            line = '******';
        }
        if (isNumberOrEnglishLetterAtTheBeginOfLine(line)) {
            line = '**' + line + '**';
        }
        if (isEmptyLine(line)) {
            line = '　';
        }
        line = addHalfsizeSpaceAtTheEndOfLine(line);
        // console.log(line);
        line = line + '\n';
        fs.writeFileSync(rfc_md, line, {'flag':'a+'});
    });

    // rl.on('pause', function() {
    //     console.log('Readline paused.');
    // });

    rl.on('resume', function() {
        console.log('Readline resumed.');
    });

    // rl.on('close', function() {
    //     console.log('Readline close.');
    // });

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
}

function isEmptyLine(line) {
    if (line.length == 0) {
        if (line == '') {
            // console.log('empty line.');
            return true;
        }
    }
    return false;
}

function isFormFeedLine(line) {
    if (line.length == 1) {
        if (line[0] == '\f') {
            // console.log('FF line.');
            return true;
        }
    }

    return false;
}

function isNumberOrEnglishLetterAtTheBeginOfLine(line) {
    if (line.length > 0) {
        var c = line.charCodeAt(0);
        if ((0x30 <= c && c <= 0x39) || (0x41 <= c && c <= 0x5A) || (0x61 <= c && c <= 0x7A)) {
            // console.log('bond line.');
            return true;
        }
    }
    return false;
}

function replaceHalfsizeSpacesWithEmSpace(line) {
    if (line.length > 1) {
        line = line.replace(/  /g, '　');
        // console.log(line);
    }
    return line;
}

function replaceEscapeCharacter(line) {
    /* http://daringfireball.net/projects/markdown/syntax#backslash */
    if (line.length > 1) {
        line = line.replace(/\\/g, '\\\\');
        line = line.replace(/\`/g, '\\`');
        line = line.replace(/\*/g, '\\*');
        line = line.replace(/\_/g, '\\_');
        line = line.replace(/\{/g, '\\{');
        line = line.replace(/\}/g, '\\}');
        line = line.replace(/\[/g, '\\[');
        line = line.replace(/\]/g, '\\]');
        line = line.replace(/\(/g, '\\(');
        line = line.replace(/\)/g, '\\)');
        line = line.replace(/\#/g, '\\#');
        line = line.replace(/\+/g, '\\+');
        line = line.replace(/\-/g, '\\-');
        line = line.replace(/\./g, '\\.');
        line = line.replace(/\!/g, '\\!');
        // console.log(line);
    }
    /* http://tool.oschina.net/commons?type=2 */
    if (line.length > 1) {
        line = line.replace(/\</g, '&lt;');
        line = line.replace(/\>/g, '&gt;');
    }
    return line;
}

function addHalfsizeSpaceAtTheEndOfLine(line) {
    return (line + '  ');
}


start();