function Sextant(interval) {
    if (!interval) { interval = 100 }
    this.urlpatterns = [];
    
    this.run(interval)
}

Sextant.prototype.UrlPatterns = function(patterns) {
    for (var i in patterns) {
        patterns[i][0] = new RegExp(patterns[i][0]);
    }
    console.dir(patterns);
    this.urlpatterns = this.urlpatterns.concat(patterns);
}

Sextant.prototype.UrlHandler = function(hash) {
    console.log(hash);
    console.dir(this.urlpatterns);
    for (var i in this.urlpatterns) {
        var p = this.urlpatterns[i];
        console.log("testing..");
        console.log(p[0]);
        console.log(hash);
        if (p[0].test(hash)) {
            p[1].display();
            break;
        } else {
            console.log(hash + " is not a match.");
        }
    }
}

Sextant.prototype.run = function(interval) {
    var last = '';
    var that = this;
    function poll() {
        if (last !== document.location.hash) {
            last = document.location.hash;
            that.UrlHandler(last);
        }
    }
    setInterval(function() { poll() } , interval);
};

Sextant.View = function(template, callback, container) {
    // Default data container
    this.container = (container) ? container : 'sextant_content';
    this.callback = (callback.constructor == Function) ? callback : function() {};
    // Need to load template from URL.
    this.template = template;
}

Sextant.View.prototype.display = function() {
    console.log("In display");
    try {
        var container = document.getElementById(this.container);
        container.innerHTML = this.template;
        this.callback();
        //  get element by id this.container
        // element.innerhtml = this.template
        // run callback
    } catch(err) {
        console.log(err);
    }
}