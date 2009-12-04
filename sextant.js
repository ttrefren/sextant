function Sextant(interval) {
    if (!interval) { interval = 100 }
    this.urlpatterns = [];
    this.DEBUG = true;
    this.run(interval)
}

Sextant.prototype.UrlPatterns = function(patterns) {
    for (var i in patterns) {
        patterns[i][0] = new RegExp(patterns[i][0]);
    }
    console.dir(patterns);
    this.urlpatterns = this.urlpatterns.concat(patterns);
}

Sextant.prototype.UrlParser = function(hash) {
/*
    Parse a hash URL into three parts.
    Ex: #/users/john/doe?name=eric&size=2
    
    url.base = '#/users/john/doe'
    url.paramstring = 'name=eric&size=2'
    url.params = { 'name': 'eric', 'size': '2' }
*/
    var url = {};
    var split = hash.split("?");
    url.base = split[0];
    url.paramstring = split[1]
    if (split[1].length) {
        var params = split[1].split("&");
        var h = '';
        for (var p in params) {
            h = params[p].split("=");
            url.params[h[0]] = h[1];
        }
    }
    if (split.length > 2 && this.DEBUG == true) {
        alert("Too many ? in hash: " + hash);
    }
    return url;
}

Sextant.prototype.UrlHandler = function(hash) {
    
    console.log(hash);
    var parsed = this.UrlParser(hash);
    console.dir(parsed);
    
    console.dir(this.urlpatterns);
    for (var i in this.urlpatterns) {
        var p = this.urlpatterns[i];
        if (p[0].test(parsed.url)) {
            var matches = p[0].exec(parsed.url);
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