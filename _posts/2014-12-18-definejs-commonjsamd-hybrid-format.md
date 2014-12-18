---
layout: post
title: "DefineJS: CommonJS/AMD Hybrid Format"
category: fixjs
tags: [DefineJS, Modular, AMD, CommonJS]
---
{% include JB/setup %}

##DefineJS v0.2.4 Released

This hybrid format allows to write modules with a CommonJS similar syntax. This feature is now possible thanks to the ES6 generators.

Let's immagine a CommonJS module like:
<pre><code class="language-javascript">//app.js
var utils = require('utils'),
  $ = require('../vendor/jquery');

var app = {
  //...
};

module.exports = app;
</code></pre>

The DefineJS alternative is:

<pre><code class="language-javascript">//app.js
define(function* (exports, module) {
  var utils = yield require('utils'),
    $ = yield require('../vendor/jquery');

  var app = {
    //...
  };

  module.exports = app;
});</code></pre>

As mentioned the new syntax is similar to the CommonJS coding style, with two specific differences. First the `yield` keyword and the next is the `define` wrapper with a `ES6 function generator`.