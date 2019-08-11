const puppeteer = require('puppeteer');
const SEARCH_PAGE_URL = "https://main.knesset.gov.il/Activity/committees/pages/allcommitteesbroadcast.aspx";
const buttonNextPageSelector = "#ctl00_ctl55_g_6be859a2_1f03_4b6f_840a_d06bc48d8551_lnkbtnNext1";

let browser, page;
let firstPage = true;

module.exports = {
  open: async function(){
    browser = await puppeteer.launch({headless:false});
    page = await browser.newPage();
    await page.goto(SEARCH_PAGE_URL);
    meetings = [];
    firstPage = true;
  },

  scrapePage: async function(){
    if(firstPage)
      firstPage = false;
    else {
      await page.click(buttonNextPageSelector);
      await page.waitFor(10*1000);
    }

    return await page.evaluate(() => {
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
  },

  close: async function(){
    await browser.close();
  }
};
