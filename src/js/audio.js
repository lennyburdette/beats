var AudioFactory = function () {

  var audio = new Audio();
  audio.preload = "auto";
  var codec = _.find(['mp3', 'ogg'], function (type) {
    return audio.canPlayType('audio/' + type) !== "";
  });

  audio.addEventListener("canplay", function () {
    broadcast(setter("canPlay", true));
  }, false);

  audio.addEventListener("durationchange", function () {
    broadcast(setter("duration", this.duration));
  }, false);

  audio.addEventListener("progress", function () {
    var end = this.buffered.length ? this.buffered.end(0) : 0;
    var duration = this.duration || 1;
    broadcast(setter("amountLoaded", Math.max(0, Math.min(1, end / duration))));
  }, false);

  audio.addEventListener("timeupdate", function () {
    broadcast(setter({
      currentTime: this.currentTime,
      timePercent: this.currentTime / this.duration
    }));
  }, false);

  audio.addEventListener("play", function () {
    broadcast(setter("paused", false));
  }, false);

  audio.addEventListener("pause", function () {
    broadcast(setter("paused", true));
  }, false);

  audio.addEventListener("ended", function () {
    broadcast(setter("paused", true));
  }, false);

  audio.addEventListener("volumechange", function () {
    broadcast(setter("volume", this.volume));
  }, false);

  var subscribers = [];
  function broadcast (func) {
    for (var i = 0, l = subscribers.length; i < l; i++) {
      func.apply(subscribers[i]);
    }
  }

  function setter () {
    var args = arguments;
    return function () {
      this.set.apply(this, args);
    };
  }

  function canSeekTo (location) {
    return audio.seekable &&
           audio.seekable.length > 0 &&
           location < audio.seekable.end(audio.seekable.length - 1);
  }

  var seekAttemptInterval;

  return {
    load : function (track) {
      broadcast(setter("canPlay", false));
      audio.src = track[codec];
      audio.load();
      broadcast(setter(track));
    },
    play : function () {
      audio.play();
    },
    pause : function () {
      audio.pause();
    },
    mute : function () {
      audio.volume = 0;
    },
    unmute : function () {
      audio.volume = 1;
    },
    seek : function (location) {
      clearInterval(seekAttemptInterval);
      var _this = this;
      if (canSeekTo(location)) {
        audio.currentTime = location;
      } else {
        seekAttemptInterval = setTimeout(function () {
          _this.seek(location + 0.05);
        }, 50);
      }
    },
    seekBy : function (amount) {
      amount = audio.duration * amount;
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + amount));
    },
    subscribe : function (subscriber) {
      if (subscribers.indexOf(subscriber) < 0) {
        subscribers.push(subscriber);
      }
    },
    get : function () {
      return audio;
    }
  };
};