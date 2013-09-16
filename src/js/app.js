var app = {
  colors: ["red", "green", "blue"]
};
app.data = {
  artist: "",
  title: "",
  duration: 0,
  currentTime: 0,
  timePercent: 0,
  amountLoaded: 0,
  volume: 1,
  canPlay: false,
  paused: true,
  queueing: false,
  color: null,

  showingMenu: false,
  showingIntro: true,
  roomFilled: false,

  searchPattern: null,
  tracks: Tracks.all,
  selectedTrackIndex: null
};

var mediator = Mediator();
var audio = AudioFactory();
var ui = UI(app.data);

audio.subscribe(ui);
audio.subscribe(title);

Scrubber(document.getElementById("time")).subscribe(function (amount) {
  audio.seekBy(amount);
  mediator.seek(ui.get("currentTime"));
});
