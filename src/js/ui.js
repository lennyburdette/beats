var UI = function (data) {
  var ui = new Ractive({
    el : document.getElementById("app"),
    template : document.getElementById("tmplPlayer").innerHTML,
    data: _.extend(data, {
      formatTime : function (time) {
        var seconds = Math.round(time % 60);
        seconds = (seconds < 10 ? "0" : "") + seconds;
        return [Math.floor(time / 60), seconds].join(":");
      },
      wrapWords : function (tag, string) {
        return "<" + tag + ">" + string.split(/\s+/).join("</" + tag + "> <" + tag + ">") + "</" + tag + ">";
      },
      urlFor : function () {
        return window.location;
      },
      playerState : function () {
        return _.pick(this, "artist", "title", "currentTime", "paused", "selectedTrackIndex");
      },
      filter: function (item, pattern) {
        var regexp = (pattern && pattern !== "") ? (new RegExp(".*" + pattern + ".*", "i")) : /.*/i;
        return regexp.test([item.title, item.artist].join(" "));
      }
    })
  });

  ui.on("playBtnPressed", function (e) {
    e.original.preventDefault();
    audio.play();
    mediator.play();
  });

  ui.on("pauseBtnPressed", function (e) {
    e.original.preventDefault();
    audio.pause();
    mediator.pause();
  });

  ui.on("muteBtnPressed", function (e) {
    e.original.preventDefault();
    audio.mute();
  });

  ui.on("unmuteBtnPressed", function (e) {
    e.original.preventDefault();
    audio.unmute();
  });

  ui.on("loveBtnPressed", function (e) {
    e.original.preventDefault();
    mediator.sendFeedback("love");
  });

  ui.on("skipBtnPressed", function (e) {
    e.original.preventDefault();
    mediator.sendFeedback("skip");
    audio.pause();
    mediator.pause();
    ui.set("showingMenu", true);
  });

  ui.on("playlistTrackSelected", function (event) {
    event.original.preventDefault();

    audio.load(event.context);
    audio.play();

    ui.set({
      showingMenu: false,
      showingIntro: false,
      selectedTrackIndex: event.index.index
    });

    mediator.playTrack(event.index.index);
  });

  ui.observe("color", function (value) {
    if (value) document.body.className = value;
  });

  ui.observe("ended", function (value) {
    if (value) {
      var nextTrackIndex = Tracks.nextIndex(ui.get('selectedTrackIndex'));
      var nextTrack = Tracks.get(nextTrackIndex);

      audio.load(nextTrack);
      audio.play();

      ui.set({
        selectedTrackIndex: nextTrackIndex
      });

      mediator.playTrack(nextTrackIndex);
    }
  });

  return ui;
};