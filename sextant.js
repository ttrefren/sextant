/*
    Sextant, a Javascript navigation framework
    by Tim Trefren (tim@mixpanel.com)
*/

function Sextant(debug, trace) {
    this.urlpatterns = [];
    this.DEBUG = debug || 0;
    this.TRACE = trace || 0;
}

Sextant.prototype.Debug = function(message, object) {
    switch(this.DEBUG) {
        case 0: // No debug statements
            break;
        case 1: // Firebug
            if (this.TRACE) { console.trace(); }
            console.log("SEXTANT DEBUG - " + message);
            if (object) {
                if (object.constructor == String) {
                    console.log(object);
                } else {
                    console.dir(object);
                }
            }
                break;
                
        case 2: // Alert
            // Will make this more robust if I need it.
            alert("SEXTANT DEBUG: " + message);
            break;
        default:
            alert("Invalid Sextant.DEBUG setting");
    }
};

Sextant.prototype.UrlPatterns = function(patterns) {
    // Compile regexes
    for (var i in patterns) {
        if (patterns.hasOwnProperty(i) && patterns[i][0].constructor == String) {
            patterns[i][0] = new RegExp(patterns[i][0]);
        }
    }
    this.urlpatterns = this.urlpatterns.concat(patterns);
};

Sextant.prototype.get_hash = function() {
    /*  Parse the hash.
        Have to use location.href, because location.hash 
        automatically unescapes itself.  This screws up our 
        URI encoding scheme.
    */
	var href = document.location.href;
	href = href.split('#');
	href.shift(); // remove first part
	var hash = href.join('#');
	if (hash.length) {
		hash = '#' + hash;
	}
	return hash;
};

Sextant.prototype.setURL = function(request) {
    document.location.hash = request.getFullURL();
};

Sextant.prototype.updateURL = function(path, params) {
    // Update a URL using a path, and merging in a set of params with the current ones
    var request = this.getURLRequest();
    request.path = path;
    request.params = $.extend(request.params, params);

    this.setURL(request);
};

Sextant.prototype.getURLRequest = function() {
    // Generate a request object based on the current hash
    var request = new Sextant.Request();
    request = this.UrlParser(request, this.get_hash());
    return request;
};

Sextant.prototype.UrlParser = function(request, hash) {
/*  Parse a hash URL into a request object.
    Ex: #/users/john/doe?name=eric&size=2
    request.path = '#/users/john/doe'
    request.params = { 'name': 'eric', 'size': '2' }
    
    Possible support for a secondary hashstring in the future, 
    e.g. #/home/dev?k=v#a
*/
    var split = hash.split("?");
    var path = split.shift();
    split = split.join('?');
    
    var params = {};    
    // Parse parameters (e.g k=v&a=b)
    if (split.length) {
        var s_params = split.split("&");
        var h = '';
        for (var p in s_params) {
            if (s_params.hasOwnProperty(p)) {
                h = s_params[p].split("=");
                // Check if key ends with []; if so it's an array
                if (/\[\]$/.test(h[0])) {
                    h[0] = h[0].replace('[]', '');
                    if (!params[h[0]]) {
                        params[h[0]] = [];
                    }
                    params[h[0]].push(decodeURIComponent(h[1]));

                } else {
                    params[h[0]] = decodeURIComponent(h[1]);
                }
            }
        }
    }

    request.setURL(path, params);    
    return request;
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
    };
    
    var request = new Sextant.Request();
    
    request = this.UrlParser(request, hash);
    var found = false;
    for (var i in this.urlpatterns) {
        if (this.urlpatterns.hasOwnProperty(i)) {
            var p = this.urlpatterns[i];
            if (p[0].test(request.path)) {
                found = p;
                var matches = p[0].exec(request.path);
                p[1].display(request, match_parser(matches));
                break;
            }
        }
    }
    if (found) {
        this.Debug("URL matched following pattern:", found);
    } else {
        this.Debug("Matching URL could not be found for hash: " + hash);
    }
};

Sextant.prototype.run = function(interval) {
    interval = interval || 100;
    var last = '',
        hash = '',
        that = this;
        
    function poll() {
		hash = that.get_hash();
        if (last !== hash) {
            last = hash;
            that.UrlHandler(last);
        }
    }
    
    function start() {
        that.runner = setInterval(function() { poll(); }, interval);
    }
    
    function stop() {
        clearInterval(that.runner);
        that.runner = null;
    }

    window.onblur = function() { 
        that.Debug("Stopping hash listener: page lost focus");
        stop(); 
    };
    
    window.onfocus = function() { 
        if (!that.runner) {
            that.Debug("Starting hash listener: page regained focus");
            start();
        }
    };
    
    start();
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
        if (this.params.hasOwnProperty(key)) {
            if (this.params[key].constructor == Array) {
                for (var i=0; i < this.params[key].length; i++) {
                    p[p.length] = key + "[]=" + encodeURIComponent(this.params[key][i]);
                }
            } else {
                p[p.length] = key + "=" + encodeURIComponent(this.params[key]);                
            }
        }
    }
    return p.join('&');
};

Sextant.Request.prototype.getFullURL = function() {
    var url = this.path;
    if (this.params != {}) {
        url += "?" + this.getQueryString();
    }
    return url;
};

Sextant.View = function(callback, container) {
    this.container = container || 'sextant_container';
    this.callback = callback || function() {};
};

Sextant.View.prototype.display = function(request, captured) {
    var args = [request].concat(captured);
    // Don't want to pass args by reference
    this.callback.apply(this, args.slice(0));
};

