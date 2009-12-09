nav.UrlPatterns([
    ["#/tim/show", views.timshow],
    [/#\/test1/, views.test1],
    ["#/test2/(\\w{1,2})/(\\w{1})", views.test2],
    // ["#/test\\d{1}/(\\w{1,2})", views.test1]
]);
