var views = {
    timshow: new Sextant.View(
        '<b>"hi there!!!!</b><div id="yo"></div>', 
        function(request) {
            var d = document.getElementById("yo");
            request.getFullURL()
            var text = "sup?<br/>";
            text += request.getFullURL();
            d.innerHTML = text;
        }
    ),
    test1: new Sextant.View(
        '<b>"sizzup!!!!</b><div id="yo"></div>', 
        function(request) {
            var d = document.getElementById("yo");
            d.innerHTML = "this is a test";
        }
    ),
    test2: new Sextant.View(
        '<b>"siasd!!!!</b><div id="yo"></div>', 
        function(request, num, letter) {
            var d = document.getElementById("yo");
            d.innerHTML = "this is a test .. the second one";
        }
    )
};

var view_related = {};
view_related.timshow = {};
view_related.timshow.blah = function() {
    
}