const months = 'ינואר פברואר מרץ אפריל מאי יוני יולי אוגוסט ספטמבר נובמבר דצמבר'.split(' ');
const dateRegex =  /(\d+)\s+([א-ת]+)\s+(\d+)/;
const timeRegex = /(\d+):(\d+)/;
module.exports = {
  parseHebrewStringToDate: function(hebrewDateString){
    let [day, month, year] = hebrewDateString.match(dateRegex).slice(1);
    let [hours, minutes] = hebrewDateString.match(timeRegex).slice(1);

    let monthIndex = months.indexOf(month.substr(1));

    //new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
    return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hours), parseInt(minutes));
  }
};
