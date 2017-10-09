$(document).ready(function() {


$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

$("#menu").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



addEventListener(document, "touchstart", function(e) {
	console.log(e.defaultPrevented);  // will be false
	e.preventDefault();   // does nothing since the listener is passive
	console.log(e.defaultPrevented);  // still false
}, Modernizr.passiveeventlisteners ? {passive: true} : false);



$(window).on('scroll',function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".upHeader").addClass("newHeader");
    } else {
        $(".upHeader").removeClass("newHeader");
    }
});






});



