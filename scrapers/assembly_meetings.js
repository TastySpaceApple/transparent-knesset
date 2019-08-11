const puppeteer = require('puppeteer');
const SEARCH_PAGE_URL = "https://main.knesset.gov.il/Activity/Plenum/Pages/Sessions.aspx";
const buttonNextPageSelector = "#ctl00_ctl56_g_fa68ca6d_6c95_4ae8_8962_acd83af4d0f0_lnkbtnNext1";

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
      await page.waitForNavigation();
      await page.waitFor(2*1000);
    }

    return await page.evaluate(() => {
      //http://online.knesset.gov.il/app/#/player/peplayer.aspx?ProtocolID=80736
      let regexMeetingId = /(\d+)\.doc/;
      let rows = document.querySelectorAll('.GridMasterTable tbody tr')

      let data = [];
      for(let i=0; i<rows.length; i++){
        let a = rows[i].querySelectorAll('a');
        let td = rows[i].querySelectorAll('td');
        let synchornizedProtocolUrl = a[2] ? a[2].href : null;
        let protocolUrl = a[0].href;

        data.push({
          meetingId: regexMeetingId.exec(protocolUrl)[1],
          committee: 'מליאה',
          title: 'ישיבת מליאה מספר ' + td[1].textContent.trim() + ' של הכנסת ה-'+td[0].textContent.trim(),
          dateString: td[2].textContent.trim(),
          synchornizedProtocolUrl: synchornizedProtocolUrl
        });
      }
      return data;
    });
  },

  close: async function(){
    await browser.close();
  }
};
