const puppeteer = require('puppeteer');
const SEARCH_PAGE_URL = "https://main.knesset.gov.il/Activity/committees/pages/allcommitteesbroadcast.aspx";

async function scrape_committees(numPagesToScrape){
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  const buttonNextPageSelector = "#ctl00_ctl55_g_6be859a2_1f03_4b6f_840a_d06bc48d8551_lnkbtnNext1";
  await page.goto(SEARCH_PAGE_URL);

  let meetings = [];
  let shouldGoToNextPage = false;

  for(let times = 0; times < numPagesToScrape; times++){
    if(shouldGoToNextPage){
      await page.click(buttonNextPageSelector);
      await page.waitFor(10*1000);
    } else shouldGoToNextPage = true;

    let data = await page.evaluate(() => {
      let regexHref = /javascript:SetAzurePlayerFileName\(\'(.*)\',\'(.*)\',\'(.*)\'\)/;
      //https://video.knesset.gov.il/KnsVod/_definst_/mp4:CMT/CmtSession_2081080.mp4/manifest.mpd
      let regexMeetingId = /\/mp4\:CMT\/.+?_(\d+)/;
      let rows = document.querySelectorAll('.RadAjaxPanel > div >table:nth-child(2) tr')
      let data = [];
      for(let i=0; i<rows.length; i+=3){
        let a = rows[i].querySelectorAll('a');
        let videoUrl = regexHref.exec(a[1].href)[1];
        console.log(videoUrl);
        console.log(regexMeetingId.exec(videoUrl)[1]);
        data.push({
          meetingId: regexMeetingId.exec(videoUrl)[1],
          committee: a[0].textContent.trim(),
          videoUrl: videoUrl,
          title: a[2].textContent.trim(),
          dateString: rows[i+1].textContent.trim(),
        });
      }
      return data;
    });
    meetings.push(...data);
  }

  //console.log("########## Committees Scrape Result ##########");
	//console.log(JSON.stringify(data, null, 4));

  await browser.close();

  return meetings;
};

module.exports = scrape_committees;
