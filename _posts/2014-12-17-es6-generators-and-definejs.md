---
layout: post
title: "ES6 Generators and DefineJS"
category: fixjs
tags: ['DefineJS', 'Modular', 'AMD']
---
{% include JB/setup %}

##DefineJS v0.2.3 Released
DefineJS v0.2.3 now offers an asynchronous but totally synchronous looking way of requiring dependencies using ES6 generators syntax, it still has a lot of possible implications but for now it could be useful if you are either using any of the modern browsers with ES6 generators syntax support, or any ES6 generators transpiler.

This is how it looks like to define a new module:

<pre><code class="language-javascript">//app.js
define(function* () {
  var _,
    app;

  //conditional dependency lodash or underscore
  if(loadashIsNeeded){
    _ = yield require('../vendor/lodash');
  } else {
    _ = yield require('../vendor/underscore');
  }

  app = {
    //...
  };

  return app;
});</code></pre>

and to require it you could do the old AMD way:

<pre><code class="language-javascript">//main.js
require(['app'],
  function (app) {
    app.lunch();
  });</code></pre>

Or the new way using ES6 generators syntax:

<pre><code class="language-javascript">//main.js
require(function* () {
  var app = yield require('app');
  app.lunch();
});</code></pre>

Which to me is much cleaner code in compared with passing dependencies as parameters. If you take a short look at the code you would see that, because of the synchronous style of coding you could even have **conditional dependencies**. It is worth noting that being able to have **conditional dependencies** makes the whole system more dynamic but on the other hand it goes through a totally different path of loading a module. For instance one of the possible debates around this approach would be the way we could concatenate this type of modules when we are not sure about their dependencies. Although I believe this type of issues and debates happen when you cross the border and com up with a new way of thinking.