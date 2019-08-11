let db = require('../services/db');

const util = require('util');

var spawn = require('child_process').spawn;

var fs = require('fs');


const months = [
  '',
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר'
]

const videosFolder = 'C:\\Users\\Idan\\Videos\\Knesset\\CommitteeMettings\\';
const indexFile = 'C:\\Users\\Idan\\Videos\\Knesset\\CommitteeMettings.html';

(async function (){
    let meetings = await db.getMeetings();
    fs.writeFileSync(indexFile, '<table dir="rtl" style="direction:rtl; font-family:Tahoma; white-space:pre-wrap;" border="1"><tr>' + ['fileName', 'title', 'description'].map(s => '<th>'+s+'</th>').join('') + '</tr>');
    for(let index = 0; index < meetings.length; index++){
      let dateParts = meetings[index].date.split(',')[0].split(' ');
      let timeParts = meetings[index].date.split(',')[2].trim().split(' ')[1].split(':');
      let day = dateParts[0], month = months.indexOf(dateParts[1].substr(1))+ '', year = dateParts[2];
      let hours = timeParts[0], minutes = timeParts[1];
      if(day.length < 2) day = "0" + day;
      if(month.length < 2) month = "0" + month;
      let fileName = year + '-' + month + '-' + day + '--' + hours + '-' + minutes + ' ' + meetings[index].committee;


      fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');

      console.log(fileName);

      if(!fs.existsSync(videosFolder + fileName + '.mp4')){
        return;
        await youtube_dl(meetings[index].videoUrl, videosFolder + fileName + '.mp4');
      }

      let title = `${day}/${month}/${year} ${hours}:${minutes} ` + meetings[index].committee + " - " + meetings[index].title;
      let description = meetings[index].committee + ' - ' + meetings[index].title + "\n\n" + meetings[index].date
      if(title.length > 80)
        title = title.substring(0, title.indexOf(" ", 70)) + '...';

      fs.appendFileSync(indexFile,
        '<tr>' +
          [fileName, title, description]
          .map(s => '<td>'+s+'</td>').join('') +
        '</tr>')
    }
    //await youtube_ul(tempFilePath, committees[0].title, description)

    console.log('done');
})()


function youtube_dl(url, outputFile){
  return new Promise((resolve, reject) => {
    let ydl = spawn('C:\\Tools\\youtube-dl\\youtube-dl', ['-o', outputFile, url]);
    let filepath = outputFile;
    console.log("starting...");
    ydl.stdout.on('data', function (data) {
      data = data.toString();
      /*if(/video\.(.*)\.mp4/.test(data)){
        filepath = /C:\\.*video\..*\.mp4/.exec(data)[0]
        console.log("\n" + "File path: " + filepath + "\n");
      }*/
      process.stdout.write("\r\x1b[K" + 'stdout: ' + data)
    });
    ydl.on('exit', function (code) {
      resolve(filepath);
      console.log('child process exited with code ' + code.toString());
    });
  })
}

function youtube_ul(filename, title, description){
  return new Promise((resolve, reject) => {
    //console.log('C:\\Tools\\youtube-ul\\youtube-ul ' + [filename, title, description].join(" "));
    let ydl = spawn('node', ['C:\\Tools\\youtube-ul\\youtube-ul.js', filename, title, description]);
    process.stdout.write("starting...");
    ydl.stdout.on('data', function (data) {
      process.stdout.write('stdout: ' + data.toString())
    });
    ydl.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
    ydl.on('exit', function (code) {
      resolve();
      console.log('child process exited with code ' + code.toString());
    });
  })
}

/*var exec = require('child_process').exec;
exec('pwd', function callback(error, stdout, stderr){
    // result
});*/
