// Mediator talks

var Mediator = function () {
  var l = window.location;
  var socket = io.connect(l.protocol + "//" + l.hostname + ":" + l.port);

  // color is chosen here
  socket.emit("joinRoom", {
    room: document.body.getAttribute("data-room"),
    color: _.sample(app.colors)
  });

  socket.on("roomJoined", function (data) {

    // and color set here
    if (data.color) {
      ui.set("color", data.color);

    // or here, choosing a different color from the other person
    } else {
      ui.set("color", _.sample(_.without(app.colors, data.notColor)));
    }

    // open the playlist for the initiator
    if (! data.invited) {
      setTimeout(function () {
        ui.set("showingMenu", true);
      }, 500);
    }
  });

  // when the guest joins, send them the current playing state
  socket.on("inviteAccepted", function (data) {
    ui.set("roomFilled", true);
    socket.emit("sync", ui.data.playerState());
  });

  // if a third person tries to sneak in, send them to a new room
  socket.on("roomDenied", function (data) {
    window.location = "/";
  });

  // sync up the player state to the initiator's state
  socket.on("sync", function (state) {
    ui.set(state);
    if (state.selectedTrackIndex) audio.load(Tracks.get(state.selectedTrackIndex));
    if (! state.paused) audio.play();
    audio.seek(state.currentTime);
    ui.set({
      showingIntro: false,
      roomFilled: true
    });
  });

  // play, pause, seek are just pass-through events
  socket.on("controlEvent", function (data) {
    audio[data.event].apply(audio, data.args || []);
  });

  // flash the appropriate alert
  socket.on("feedback", function (data) {
    Alert.flash(data.type, data.color);
  });

  // play track by track index (track ID probably makes more
  // sense but I don't have one.)
  socket.on("playTrack", function (data) {
    audio.load(Tracks.get(data.trackIndex));
    audio.play();

    ui.set({
      selectedTrackIndex: data.trackIndex
    });
  });

  // all alone =(
  socket.on("roomLeft", function () {
    ui.set("roomFilled", false);
  });

  return {
    play : function () {
      socket.emit("controlEvent", { event: "play" });
    },

    pause : function () {
      socket.emit("controlEvent", { event: "pause" });
    },

    seek : function (time) {
      socket.emit("controlEvent", { event: "seek", args: _.toArray(arguments) });
    },

    playTrack : function (trackIndex) {
      socket.emit("playTrack", { trackIndex: trackIndex });
    },

    sendFeedback : function (type) {
      socket.emit("feedback", { type: type, color: ui.get("color") });
    }
  };
};