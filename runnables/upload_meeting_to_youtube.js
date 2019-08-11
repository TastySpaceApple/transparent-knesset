const tools = require('./external_tools');
const db = require('../services/db');
const fs = require('fs')

let meetingId = process.argv[2];

let tempFileLocation = 'C:\\Sandbox\\file.mp4';
(async function(){
  if(!meetingId)
    return console.log('No meeting id supplied');
  let meetings = await db.getMeetings({"meetingId": meetingId});
  let meeting = meetings[0];
  console.log(meeting);

  fs.unlinkSync(tempFileLocation);
  await tools.youtube_dl(meeting.videoUrl, tempFileLocation);

  let date = meeting.date;
  let [day, month, year, hours, minutes] =
      [date.getDate(), date.getMonth()+1, date.getFullYear(), date.getHours(), date.getMinutes()].map(n => padWithZeros(n, 2))
  let title = `${day}/${month}/${year} ${hours}:${minutes} ` + meeting.committee + " - " + meeting.title;
  let description = meeting.committee + ' - ' + meeting.title + "\n\n" + meeting.dateString
  if(title.length > 80)
    title = title.substring(0, title.indexOf(" ", 70)) + '...';

  let youtubeVideoId = await tools.youtube_ul(tempFileLocation, title, description)
  meeting.youtubeUrl = 'https://www.youtube.com/watch?v=' + youtubeVideoId;
  await meeting.save();
})()

function padWithZeros(number, minLength){
  let s = number + '';
  for(let i=s.length; i<minLength; i++) s = '0' + s;
  return s;
}
