(function () {
  var colophon = document.querySelector(".colophon");

  document.querySelector(".btn-colophon").addEventListener("click", function (e) {
    e.preventDefault();
    colophon.style.display = "block";
  }, false);

  colophon.addEventListener("click", function (e) {
    if (e.target == this) this.style.display = "none";
  }, false);
}());
