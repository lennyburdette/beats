var Scrubber = function (element) {

  var subscribers = [];
  var position;

  element.addEventListener("mousedown", function (e) {
    e.preventDefault();
    position = e.screenY;
    addDragEvents();
  }, false);

  function onDrag (e) {
    e.preventDefault();
    var diff = e.screenY - position;
    var percent = diff / window.innerHeight;
    broadcast(percent);
    position = e.screenY;
  }

  function dragEnded () {
    position = null;
    removeDragEvents();
  }

  function addDragEvents () {
    document.addEventListener("mousemove", onDrag, false);
    window.addEventListener("mouseup", dragEnded, false);
  }

  function removeDragEvents () {
    document.removeEventListener("mousemove", onDrag, false);
    window.removeEventListener("mouseup", dragEnded, false);
  }

  function broadcast (amount) {
    for (var i = 0, l = subscribers.length; i < l; i++) {
      subscribers[i](amount);
    }
  }

  return {
    subscribe : function (subscriber) {
      if (subscribers.indexOf(subscriber) < 0) {
        subscribers.push(subscriber);
      }
    }
  };
};
