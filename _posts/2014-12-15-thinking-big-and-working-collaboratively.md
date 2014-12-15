---
layout: post
title: "Thinking Big and Working Collaboratively"
description: ""
category: 
tags: []
---
{% include JB/setup %}

**Dave Herman** says:

> **For the Web to compete with native platforms**, I believe we have to think big. This means building on our competitive strengths like URLs and dynamic loading, as well as taking a hard look at our platform’s weaknesses — lack of access to modern hardware, failures of the offline experience, or limitations of cross-origin communication, to name a few.

As JavaScript enthusiasts and front end developers, this is what we are mostly concerned with and just by taking a quick look at the latest JavaScript trends and technology stacks around it, we will see the unleashed power of **JavaScript** as a programming language.

This is my first post here and I thought why not start off with one of the latest exciting talks which caught my eye when I first looked at the title:

[Jaswanth Sreeram: Parallel JavaScript](https://www.youtube.com/watch?v=Ls27mCiYsQo)

Let's imagine what could be the possible implications of this talk.

Not being able to create parallel threads in JavaScript might be considered as a missing feature, but the JavaScript [Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop) have always helped us to meet the project's requirements.

Amazingly, [Web workers](https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers) ([The Basics of Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/#toc-enviornment-subworkers)) also provide a simple means for web content to run scripts in background threads. It still has its own rules and restrctions but in terms of optimization and performance, Web Workers are really helpful.

Using JavaScript asynchronous APIs also provides us with an interesting way of having a parallel process in one thread, which is basically possible totally because of the JavaScript's [Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop).

Considering all these, when I first read the title(**Parallel JavaScript**) I thought it would be somehow related to one of the points above, **BUT** interestingly it is not.

That's why I found this talk is really interesting. Just imagine what **"Parallel JavaScript on GPU"** would bring us, even without us having to deal with the different implications of it, to make it compatible with all the different hardwares.

I really liked it because I believe it is totally alighed with JavaScript's future path.

Really highly recommended to watch and in case you are more interested to read, you could find the text here:

[Jaswanth Sreeram: Parallel JavaScript - Transcript](http://2014.jsconf.eu/speakers/jaswanth-sreeram-parallel-javascript.html)