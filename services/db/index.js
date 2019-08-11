const mongoose = require('mongoose');

const connection_string = process.env.DATABASE_CONNECTION_STRING || require('../../config.js').DATABASE_CONNECTION_STRING;

mongoose.connect(connection_string,
  err => {
    if (err) throw err;
    console.log("connected")
  }
);
var Schema = mongoose.Schema;

let speechSchema = new Schema({
    meetingId: Number,
    time: Number,
    index:Number,
    speaker: String, //TODO: speaker id as member id
    paragraphs: []
})

let meetingSchema = new Schema({
  meetingId: String,
  committee: String,
  videoUrl: String,
  title: String,
  date: Date,
  dateString: String,
  youtubeUrl: String,
  protocolUrl: String,
  synchornizedProtocolUrl: String
})

let memberSchema = new Schema({
  name: String,
  party: String,
  imageUrl: String,
})


let Meeting = mongoose.model('Meeting', meetingSchema)
, Member = mongoose.model('Member', memberSchema)
, Speech = mongoose.model('Speech', speechSchema) // a speech is what a member said in a meeting

module.exports = {
  addOrUpdateMeeting: function(meeting){
    console.log(meeting);
    return Meeting.updateOne({meetingId: meeting.meetingId},
      {$set: meeting}, {upsert: true, setDefaultsOnInsert: true, new:false});
  },

  addSpeeches: function(meetingId, speechesArray, clear){
    return (clear ? this.clearSpeechesForMeeting(meetingId) : Promise.resolve())
      .then(() => Speech.insertMany(speechesArray));
  },

  clearSpeechesForMeeting: function(meetingId){
    return Speech.deleteMany({ meetingId }) // clear all speeches with this meetingId
  },

  getSpeeches: function(filter){
    return Speech.find(filter || {}).sort('time');
  },

  getMeetings: function(filter){
    return Meeting.find(filter || {}).sort('-date');
  },

  removeMeetings: function(filter){
    return Meeting.deleteMany(filter);
  },

  setMembers: function(members){
    return this.clearMembers()
            .then(() => Member.insertMany(members))
    ;
  },
  clearMembers : function(){
    return Member.deleteMany({ })
  },

  getMemberImageUrlByName: function(name){
    return Member.findOne({name}).then(member => member.imageUrl);
  }

};
