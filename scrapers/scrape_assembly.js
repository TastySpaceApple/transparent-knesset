const puppeteer = require('puppeteer');
const ASSEMBLY_PLAYER_URL = "http://online.knesset.gov.il/app/#/player/peplayer.aspx?ProtocolID=";

async function scrape_assembly(protocolId){
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto(ASSEMBLY_PLAYER_URL + protocolId);

  const data = await page.evaluate(() => {

    const protocolId = /ProtocolID\=(\d+)/i.exec(window.location.href)[1];

    const API_URL_PROTOCOL = 'http://online.knesset.gov.il/api/Protocol/GetProtocolBulk';
    const API_URL_BK = 'http://online.knesset.gov.il/api/Protocol/WriteBKArrayData';
    const API_URL_VIDEOPATH = 'http://online.knesset.gov.il/api/Protocol/GetVideoPath';

    async function scrape(){
      let times; // the times within the video
      let html; // the html of the assembly's protocol

      // 1. get times
      times = await get("GET", API_URL_BK, {sProtocolNum: protocolId}).catch(e => console.log(e));

    	let hasLastTextRegExp = new RegExp('txt_' + (times.length - 1));

      let getTimeById = (timeId) => times[timeId.substring('txt_'.length)];

      // 2. scrape all the pages for html
      let pageNum = 0;
      let pageContent = '';

    	while(!hasLastTextRegExp.test(pageContent)){
    		let page = await get("GET", API_URL_PROTOCOL, {sProtocolNum: protocolId, pageNum: pageNum++}).catch(e => console.log(e));
        pageContent = page.sContent;
    		html += pageContent;
        await timeout(1200);
    	}

      // 3. parse it all
      let doc = document.createElement('div');
  		doc.innerHTML = html;
  		let speeches = [];
  		let subjects = [];
  		let assembly = {};
  		let speech = null;
  		let subject;
  		let child;

  		assembly.protocolId = protocolId;
  		assembly.videoUrl = document.querySelector('video source').src;

  		for(var i=0, len=doc.children.length; i<len; i++){
  			child = doc.children[i];
  			if(child.className == "SPEAKER" || child.className == "YOR"){
  				if(speech) speeches.push(speech);
  				speech = {protocolId, speaker: child.textContent, paragraphs: [], time: getTimeById(child.firstChild.id), index: speeches.length}
  			}
  			if(child.firstChild.className == "SUBJECT"){
  				speech = null;
  				subject = {protocolId, title: child.textContent, time: getTimeById(child.firstChild.firstChild.id) , index: subjects.length };
  				subjects.push(subject);
  			}
  			if(speech != null){
  				if(child.textContent != speech.speaker && /[^\s]/.test(child.textContent))
  					speech.paragraphs.push(child.textContent);
  			} else if(!('subtitle' in assembly)){
  				if('title' in assembly)
  					assembly.subtitle = child.textContent;
  				else
  					assembly.title = child.textContent;
  			}
  		}
  		speeches.push(speech);
      return { protocolId, speeches, subjects, assembly };
    }

    // util methods

    // A. util xml http request with Promise
    function get(method, url, params){
    	let xhr = new XMLHttpRequest();
    	let queryString = params ? Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';
    	xhr.open(method, url + '?' + queryString);
    	console.log(url + '?' + queryString);

    	return new Promise( (resolve, reject) => {
    	  xhr.addEventListener("load", () => {
    		  resolve(JSON.parse(xhr.responseText));
    	  });
    	  xhr.send(params.protocolNum || null);
      })
    }
    // B. util wait time Promise
    function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

		return scrape();
  });

  console.log("########## Assembly Scrape Result ##########");
	console.log("Speeches: " + data.speeches.length)
	console.log("Subjects: " + data.subjects.length)
	console.log("Assembly: ");
	console.log(JSON.stringify(data.assembly, null, 4));

  await browser.close();

  return data;
};

module.exports = scrape_assembly;
