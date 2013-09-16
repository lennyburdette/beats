// App state is stored on this object and passed
// to the Ractive-powered UI
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

// Mediator talks to the server with web sockets
var mediator = Mediator();
// Audio is the wrapper around the HTML5 audio element
// with event listeners.
var audio = AudioFactory();
// ui is a Ractive controller
var ui = UI(app.data);

// The audio object will broadcast all state changes
// to subscribed objects by calling "set()" on them.
// Ractive supports this interface, and I adapted it
// for use with the title element.
audio.subscribe(ui);
audio.subscribe(Title);

// Special UI element since Ractive doesn't do this
// silly kind of dragging interaction
Scrubber(document.getElementById("time")).subscribe(function (amount) {
  audio.seekBy(amount);
  mediator.seek(ui.get("currentTime"));
});
