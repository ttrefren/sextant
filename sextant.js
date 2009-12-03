function Sextant() {
    this.urlpatterns = [];
}

Sextant.prototype.UrlPatterns = function(patterns) {
    this.urlpatterns = [];
}

Sextant.prototype.UrlHandler = function(hash) {
    console.log(hash);
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

Sextant.prototype.View = function(container, template, callback) {
    // Default data container
    this.container = (container) ? container : 'sextant_content';
    this.template = template;
    this.callback = callback;
}

Sextant.prototype.View.display = function() {
    try {
        //  get element by id this.container
        // element.innerhtml = this.template
        // run callback
    } catch(err) {
        console.log(err);
    }
}