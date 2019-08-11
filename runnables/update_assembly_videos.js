const db = require('../services/db');
const util = require('../util');

const scraper = require('../scrapers/assembly_synchronized_protocol');
//console.log( util.parseHebrewStringToDate("5 באוגוסט 2019, ד' באב תשעט, בשעה 16:00").getHours() );

(async function(){
  await scraper.open();

  let meetings = await db.getMeetings({"committee": "מליאה"});

  for(let meeting of meetings){
    if(!meeting.videoUrl && meeting.synchornizedProtocolUrl){
      let {videoUrl} = await scraper.scrapePage(meeting.synchornizedProtocolUrl);
      meeting.videoUrl = videoUrl;
      console.log(`[meeting#${meeting.meetingId}] new video url: ` + videoUrl);
      await meeting.save();
    }
  }
  /*await scraper.open();

  for(pageIndex = 0; pageIndex < 3; pageIndex++){
    let meetings = await scraper.scrapePage();
    let operations = []
    meetings.forEach((meeting, i) => {
      meeting.date = util.parseHebrewStringToDate(meeting.dateString);
      operations.push(db.addOrUpdateMeeting(meeting));
    });
    await Promise.all(operations)
  }*/
  await scraper.close();
})()
