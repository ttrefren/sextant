/*
    Sextant, a Javascript navigation framework
    by Tim Trefren (tim@mixpanel.com)
*/


function Sextant(interval, debug) {
    if (!interval) { interval = 100 }
    this.urlpatterns = [];
    this.DEBUG = (debug) ? debug : 0;
    this.run(interval)
};

Sextant.prototype.Debug = function(message) {
    switch(this.DEBUG) {
        case 0: // No debug statements
            break;
        case 1: // Firebug
            console.log("SEXTANT_DEBUG:");
            console.trace();
            if (message.constructor == String) {
                console.log(message);
            } else {
                console.dir(message);
            }
            break;
        case 2: // Alert
            alert("SEXTANT_DEBUG" + message);
        default:
            alert("Invalid Sextant.DEBUG setting");
    }
};

Sextant.prototype.UrlPatterns = function(patterns) {
    for (var i in patterns) {
        patterns[i][0] = new RegExp(patterns[i][0]);
    }
    this.urlpatterns = this.urlpatterns.concat(patterns);
};

Sextant.prototype.UrlParser = function(hash) {
/*
    Parse a hash URL into three parts.
    Ex: #/users/john/doe?name=eric&size=2
    
    url.base = '#/users/john/doe'
    url.paramstring = 'name=eric&size=2'
    url.params = { 'name': 'eric', 'size': '2' }
*/
    var url = new Sextant.URL();
    var split = hash.split("?");
    this.Debug(split);
    url.base = split[0];
    url.paramstring = split[1];
    if (split.length > 1) {
        var params = split[1].split("&");
        var h = '';
        for (var p in params) {
            h = params[p].split("=");
            url.params[h[0]] = h[1];
        }
    }
    if (split.length > 2) {
        this.Debug("Too many '?' in hash url: " + hash);
    }
    return url;
};

Sextant.prototype.UrlHandler = function(hash) {
    var that = this;
    var match_parser = function(matches) {
        var i = 1;
        var m = [];
        console.log('match_parser')
        that.Debug(matches);
        
        while(matches !== null && matches[i] !== undefined) {
            m[m.length] = matches[i];
            i++;
        }
        that.Debug(m);
        return m;
    }
    
    var url = this.UrlParser(hash);
    var found = false;
    for (var i in this.urlpatterns) {
        var p = this.urlpatterns[i];
        if (p[0].test(url.base)) {
            this.Debug(hash + " is a match!");
            var matches = p[0].exec(url.base);
            p[1].display(match_parser(matches), url);
            found = true;
            break;
        } else {
            this.Debug(hash + " is not a match.");
        }
    }
    if (!found) {
        this.Debug("URL could not be found: " + hash);
    }
};

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


Sextant.URL = function(base, params, paramstring) {
    this.base = (base) ? base : '';
    this.params = (params) ? params : [];
    this.paramstring = (paramstring) ? paramstring : '';
};

Sextant.URL.prototype.getFullURL = function() {
    var url = this.base;
    if (this.paramstring.length) {
        url += "?" + this.paramstring;
    }
    return url;
};

Sextant.View = function(template, callback, container) {
    // Default data container
    this.container = (container) ? container : 'sextant_content';
    this.callback = (callback.constructor == Function) ? callback : function() {};
    // Need to load template from URL.
    this.template = template;
};

Sextant.View.prototype.display = function(matches, url) {
    console.log("In display");
    try {
        var container = document.getElementById(this.container);
        container.innerHTML = this.template;
        console.log("display: matches")
        console.dir(matches)
        this.callback.apply(this, matches);
    } catch(err) {
        this.Debug(err);
    }
};