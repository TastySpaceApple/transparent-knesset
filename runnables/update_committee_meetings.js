const db = require('../services/db');
const util = require('../util');

const scraper = require('../scrapers/committee_meetings');
//console.log( util.parseHebrewStringToDate("5 באוגוסט 2019, ד' באב תשעט, בשעה 16:00").getHours() );

(async function(){
  await scraper.open();
  for(pageIndex = 0; pageIndex < 3; pageIndex++){
    let meetings = await scraper.scrapePage();
    let operations = []
    meetings.forEach((meeting, i) => {
      meeting.date = util.parseHebrewStringToDate(meeting.dateString);
      operations.push(db.addOrUpdateMeeting(meeting));
    });
    await Promise.all(operations)
  }
  await scraper.close();
})()
