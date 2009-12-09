/*
    Sextant, a Javascript navigation framework
    by Tim Trefren (tim@mixpanel.com)
*/


function Sextant(interval, debug, trace) {
    if (!interval) { interval = 100 }
    this.urlpatterns = [];
    this.DEBUG = (debug) ? debug : 0;
    this.TRACE = (trace) ? trace : 0;
    this.run(interval)
};

Sextant.prototype.Debug = function(message, object) {
    message = (message) ? message : '';
    object = (object) ? object : {};
    switch(this.DEBUG) {
        case 0: // No debug statements
            break;
        case 1: // Firebug
            if (this.TRACE) { console.trace(); }
            console.log("SEXTANT DEBUG - " + message);
            if (object.constructor == String) {
                console.log(object);
            } else {
                console.dir(object);
            }
            break;
        case 2: // Alert
            // Will make this more robust if I need it.
            alert("SEXTANT DEBUG: " + message);
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

Sextant.prototype.UrlParser = function(request, hash) {
/*  Parse a hash URL into three parts.
    Ex: #/users/john/doe?name=eric&size=2
    
    url.base = '#/users/john/doe'
    url.params = { 'name': 'eric', 'size': '2' }
    
    Possible support for a secondary hashstring in the future, 
    e.g. #/home/dev?k=v#a
*/
    var split = hash.split("?");
    this.Debug("URL base, params after splitting", split);
    
    var path = split[0];
    var params = {};
    
    // Parse parameters (e.g k=v&a=b)
    if (split.length > 1) {
        var s_params = split[1].split("&");
        var h = '';
        for (var p in s_params) {
            h = s_params[p].split("=");
            params[h[0]] = h[1];
        }
    }
    if (split.length > 2) {
        this.Debug("Too many '?' in hash url: " + hash);
    }
    request.setURL(path, params);
    return {}
};

Sextant.prototype.UrlHandler = function(hash) {
/*  Match hashstring against registered URLs.
    If found, execute the view's display function.
    
    Passes captured arguments to the view.
*/
    var match_parser = function(matches) {
        var i = 1, m = [];
        while(matches[i] !== undefined) {
            m[m.length] = matches[i];
            i++;
        }
        return m;
    }
    var request = new Sextant.Request();
    
    this.UrlParser(request, hash);
    var found = false;
    for (var i in this.urlpatterns) {
        var p = this.urlpatterns[i];
        if (p[0].test(request.path)) {
            found = p;
            var matches = p[0].exec(request.path);
            p[1].display(request, match_parser(matches));
            break;
        } 
    }
    if (found) {
        this.Debug("URL matched following pattern:", p);
    } else {
        this.Debug("Matching URL could not be found for hash: " + hash);
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


Sextant.Request = function(path, params) {
    this.path = (path) ? path : '';
    this.params = (params) ? params : {};
};

Sextant.Request.prototype.setURL = function(path, params) {
    this.path = (path) ? path : '';
    this.params = (params) ? params : {};
};

Sextant.Request.prototype.getQueryString = function() {
    var p = [];
    for (var key in this.params) {
        p[p.length] = key + "=" + this.params[key];
    }
    return p.join('&');
};

Sextant.Request.prototype.getFullURL = function() {
    var url = this.path;
    if (this.params != {}) {
        url += "?" + this.getQueryString;
    }
    return url;
    console.log(url);
};

Sextant.View = function(template, callback, container) {
    // Default data container
    this.container = (container) ? container : 'sextant_content';
    this.callback = (callback.constructor == Function) ? callback : function() {};
    // Need to load template from URL.
    this.template = template;
};

Sextant.View.prototype.display = function(request, captured) {
    try {
        var container = document.getElementById(this.container);
        container.innerHTML = this.template;
        this.callback.apply(this, [request].concat(captured));
    } catch(err) {
        this.Debug("View error:", err);
    }
};