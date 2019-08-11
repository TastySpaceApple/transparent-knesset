var spawn = require('child_process').spawn;

module.exports = {
  youtube_dl: function (url, outputFile){
    return new Promise((resolve, reject) => {
      let ydl = spawn('C:\\Tools\\youtube-dl\\youtube-dl', ['-o', outputFile, url]);
      console.log("starting...");
      ydl.stdout.on('data', function (data) {
        data = data.toString();
        process.stdout.write("\r\x1b[K" + 'stdout: ' + data)
      });
      ydl.on('exit', function (code) {
        resolve(outputFile);
        console.log('child process exited with code ' + code.toString());
      });
    })
  },

  youtube_ul: function(filename, title, description){
    return new Promise((resolve, reject) => {
      let regexVideoId = /\(VIDEO_ID\=(.*)\)/
      let videoId;
      let ydl = spawn('C:\\Tools\\youtube-ul\\youtube-ul', ['C:\\Tools\\youtube-ul\\credentials.json', filename, title, description]);
      process.stdout.write("starting...");
      ydl.stdout.on('data', function (data) {
        data = data.toString();
        if(regexVideoId.test(data))
          videoId = regexVideoId.exec(data)[1];
        process.stdout.write('stdout: ' + data)
      });
      ydl.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
      });
      ydl.on('exit', function (code) {
        resolve(videoId);
        console.log('child process exited with code ' + code.toString());
      });
    })
  }
}
