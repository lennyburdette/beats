var Mediator = function () {
  var l = window.location;
  var socket = io.connect(l.protocol + "//" + l.hostname + ':' + l.port);
  socket.emit('joinRoom', {
    room: document.body.getAttribute('data-room'),
    color: _.sample(app.colors)
  });

  socket.on('roomJoined', function (data) {
    if (data.color) {
      ui.set('color', data.color);
    } else {
      ui.set('color', _.sample(_.without(app.colors, data.notColor)));
    }

    if (! data.invited) {
      setTimeout(function () {
        ui.set('showingMenu', true);
      }, 500);
    }
  });

  socket.on('inviteAccepted', function (data) {
    ui.set('roomFilled', true);
    socket.emit('sync', ui.data.playerState());
  });

  socket.on('roomDenied', function (data) {
    console.log('roomDenied', arguments);
  });

  socket.on('sync', function (state) {
    ui.set(state);
    audio.load(Tracks.get(state.selectedTrackIndex));
    audio.play();
    audio.seek(state.currentTime);
    ui.set({
      showingIntro: false,
      roomFilled: true
    });
  });

  socket.on('controlEvent', function (data) {
    audio[data.event].apply(audio, data.args || []);
  });

  socket.on('feedback', function (data) {
    Alert.flash(data.type);
  });

  socket.on('playTrack', function (data) {
    audio.load(Tracks.get(data.trackIndex));
    audio.play();

    ui.set({
      selectedTrackIndex: data.trackIndex
    });
  });

  socket.on('roomLeft', function () {
    ui.set('roomFilled', false);
  });

  return {
    play : function () {
      socket.emit('controlEvent', { event: "play" });
    },

    pause : function () {
      socket.emit('controlEvent', { event: "pause" });
    },

    seek : function (time) {
      socket.emit('controlEvent', { event: "seek", args: _.toArray(arguments) });
    },

    playTrack : function (trackIndex) {
      socket.emit('playTrack', { trackIndex: trackIndex });
    },

    sendFeedback : function (type) {
      socket.emit('feedback', { type: type });
    }
  };
};