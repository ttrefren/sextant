console.log("In views");

var views = {
    timshow: new Sextant.View('<b>"hi there!!!!</b><div id="yo"></div>', function() {
        var d = document.getElementById("yo");
        d.innerHTML = "sup";
    }),
    
    test1: new Sextant.View('<b>"sizzup!!!!</b><div id="yo"></div>', function() {
        var d = document.getElementById("yo");
        d.innerHTML = "this is a test";
    }),
    
    test2: new Sextant.View(
        '<b>"siasd!!!!</b><div id="yo"></div>', 
        function(num, letter) {
            var d = document.getElementById("yo");
            d.innerHTML = "this is a test .. the second one";
            console.log("printing arguments");
            console.log(num);
            console.log(letter);
            console.dir(arguments);
        }
    )
};

var view_related = {};
view_related.timshow = {};
view_related.timshow.blah = function() {
    
}