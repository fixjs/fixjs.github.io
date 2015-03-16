---
layout: post
title: "About Ugma"
description: ""
category: fixjs
tags: [Ugma, JavaScript]
---
{% include JB/setup %}

##A better alternative
I have always had a dream to implement something cool, lightweight and handy, something which allows JavaScript develelopers to come up with a nice looking JavaScript app without them having to spend ages on coding. For sure [jQuery](http://jquery.com/) has been one of the best during the whole of my career as JavaScript dev __BUT__ as we all now know it has a lot of issues like the one that I read about couple of weeks ago: [Investigate the performance and consider the removal of usage of .hide() and .show() from Javascript](https://github.com/easydigitaldownloads/Easy-Digital-Downloads/issues/3065).

The point is not just about a performance bottlenecks. Other than performance, what I usually have in my concerns list, are code size, DOM API, browser support, cross device coding priciples and stuff like that, which [jQuery](http://jquery.com/) usually offers a whole bunch of solutions for them. But now I've got a better alternative which is [Ugma](https://github.com/ugma/ugma) made by someone: [kflash](https://github.com/kflash) who has a really brilliant ideas on how to acheieve all of them without killing the code size, someone who I know in person. I made this post as the initial post for providing him with my feedbacks.

- __emptyFunction__: I like the way the emptyFunction is being used as a 
I Combinator/Identity function. SO why nit changing its name to something more meaningfull like `identity.js` or `identityFunction.js` instead of `emptyFunction.js`.

- __inheritance__: I don't really believe the old fashioned way of inheritance in JavaScript is a good way of implementing an inheritance model:

```javascript
function Document(node) {
  return Element.call(this, node.documentElement);
}

Document.prototype = new Element();
```

This way the constructor function is getting called twice. But if I were to do this, I'd do something like:

```javascript
function Document(node) {
  return Element.call(this, node.documentElement);
}

var proto = Object.create(Element.prototype);
Document.prototype = Object.create(Element.prototype);
proto.constructor = Document;
```

as it is obvious if constructor function adds new attributes to the context it will work because `Document` is calling the `Element` constructor itself. 