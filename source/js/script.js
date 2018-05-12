var b1 = document.getElementById("b1");
var b2 = document.getElementById("b2");

window.onload = function(){
  if (window.matchMedia("(min-width: 1280px)").matches) {
    b1.parentNode.insertBefore(b2, b1);
  }
}

window.onresize = function() {
  if (window.matchMedia("(min-width: 1280px)").matches) {
    b1.parentNode.insertBefore(b2, b1);
  }

  if (window.matchMedia("(max-width: 1279px)").matches) {
    b1.parentNode.insertBefore(b1, b2);
  }
}
