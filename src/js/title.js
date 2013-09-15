var title = {
  paused: true,
  set: function (prop, value) {
    if (typeof value === "undefined") {
      for (var key in prop) {
        this._set(key, prop[key]);
      }
    } else {
      this._set(prop, value);
    }
  },
  _set: function (prop, value) {
    switch (prop) {
      case "paused":
      case "title":
      case "artist":
        this[prop] = value;
        this.updateTitle();
      break;
      default:
    }
  },
  updateTitle : function () {
    if (! this.paused) {
      document.title = "► " + this.title + " by " + this.artist + " | beats";
    } else {
      document.title = "beats";
    }
  }
};