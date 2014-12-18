---
layout: post
title: "DefineJS v0.2.2 Released"
category: fixjs
tags: [JavaScript, AMD, DefineJS]
---
{% include JB/setup %}

The new version with a whole bunch of examples and couple of new features, is ready to use. DefineJS now offers `Promissed Modules` and `use()` syntax.

##Promised Modules
Using the same AMD module style you can have privileged promise based modules. 
All you need to do is just returning a promise in your modules, to make them promised modules. 
To see how it works, just check out the `simple-promised-module example` in the examples folder.

In this example we have a promised module named: promisedModule.js 
which is responsible to wait for a specific global variable, and serves it as the module's promised value.

<pre><code class="language-javascript">define([ /*'dependency'*/ ], function ( /*dependency*/ ) {

  return new Promise(function (fulfill, reject) {
    // Here you expect to have a global variable named:
    // myApp after 2 seconds
    // otherwise your module definition gets rejected

    setTimeout(function () {
      if (window.myApp !== undefined) {

        // fulfill when succeeded and pass the fulfillment value
        fulfill({
          app: window.myApp,
          log: 'This is just a sample promised object!'
        });

      } else {

        // reject in case of error or unsuccessful operations
        reject(new Error('No global myApp object found!!'));
      }

    }, 2000);
  });

});</code></pre>

Now you could easily require it, or add it as a dependency. What will happen is, it waits for your promise to get resolved then you will have the promised module object.

<pre><code class="language-javascript">// main.js
require(['promisedModule'],
  function (promisedModule) {
    console.log(promisedModule.log);
    // =>This is just a sample promised object!
    console.log(promisedModule.app);
  });</code></pre>


###Note:
we are still discussing about the proper way of handling the rejected state of a promised module. Any feedback or proposal is really appreciated.

##use() vs require()
You can also have the same modules flow using a new offered syntax by DefineJS:

<pre><code class="language-javascript">use(['dependency1', 'dependency2'])
  .then(function (dependency1, dependency2) {
    // ...
    return dependency1.util;
  })
  .then(function (util) {
    // ...
    // use util object if it has any useful functionality
    return util.map([ /*...*/ ]);
  })
  .catch(function (e) {
    // in case of having a rejected promised module or any async error
    console.error(e);
  });</code></pre>

