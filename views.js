console.log("In views");

var views = {
    timshow: new Sextant.View('<b>"hi there!!!!</b><div id="yo"></div>', function() {
        var d = document.getElementById("yo");
        d.innerHTML = "sup";
    }),
    
    test1: new Sextant.View('<b>"sizzup!!!!</b><div id="yo"></div>', function() {
        var d = document.getElementById("yo");
        d.innerHTML = "this is a test";
    })
};