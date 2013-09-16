var Alert = (function () {

  function setTypeSize (el) {
    var size = window.innerHeight * 0.9 + "px";
    _.each(el.querySelectorAll(".glyphicon"), function (el) {
      el.style.fontSize = size;
      el.style.lineHeight = size;
    });
  }

  var transEndEventNames = {
    WebkitTransition: "webkitAnimationEnd",
    MozTransition:    "animationend",
    OTransition:      "oAnimationEnd",
    msTransition:     "MSAnimationEnd",
    transition:       "animationend"
  };

  var el = document.createElement("div");
  var transition = _.find(_.keys(transEndEventNames), function (name) {
    return name in el.style;
  });
  var transitionEnd = transEndEventNames[transition];

  var iconMap = {
    love: "heart",
    skip: "remove"
  };

  function create (type) {
    var frag = document.createElement("div");
    frag.innerHTML = '<div class="alert screen ' + type + '"><i class="glyphicon glyphicon-' + iconMap[type] + '"></i></div>';
    var el = frag.firstChild;

    el.addEventListener(transitionEnd, function () {
      this.parentNode.removeChild(this);
    });

    frag = null;
    return el;
  }

  return {
    flash : function (which, color) {
      var el = create(which);
      setTypeSize(el);
      document.body.appendChild(el);
      el.className += " show " + color;
    }
  };
}());