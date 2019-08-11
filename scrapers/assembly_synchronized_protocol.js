const puppeteer = require('puppeteer');
const SEARCH_PAGE_URL = "https://main.knesset.gov.il/Activity/Plenum/Pages/Sessions.aspx";
const buttonNextPageSelector = "#ctl00_ctl56_g_fa68ca6d_6c95_4ae8_8962_acd83af4d0f0_lnkbtnNext1";

let browser, page;
let firstPage = true;

module.exports = {
  open: async function(url){
    browser = await puppeteer.launch({headless:false});

  },

  scrapePage: async function(url){
    page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(2*1000);
    await page.waitForSelector('video source');

    let videoUrl = await page.evaluate(() =>
      document.querySelector('video source').src)
    await page.close();
    return {videoUrl: videoUrl}
  },

  close: async function(){
    await browser.close();
  }
};
