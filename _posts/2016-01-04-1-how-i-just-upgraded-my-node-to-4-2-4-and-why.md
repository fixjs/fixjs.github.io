---
layout: post
title: "How I just upgraded my node 4.2.4 and why?"
category: news
tags: [JavaScript, Node.js, NPM]
---
{% include JB/setup %}

I just upgraded my Node from `4.2.1` to `4.2.4` and I saw there are two points in this process which are worth sharing. First why I upgraded to 4.2.4 and not v5.0 and second which sounds funny to me that on my local machine I use `nvm` but in my production servers I still use `n` because it sounds more reliable. Please correct me if you think I am mistaken about that.

##Why 4.2.4 and not 5.x?
I listen to a Node.js podcast called [NodeUP](http://nodeup.com/) which is highly recommended. In its latest episode ([96 - A Node v5.0 Show](http://nodeup.com/ninetysix)) one of the panelists asks Rod Vagg and Rebecca Turner both from the main npm and node team:
> Should I be running or Node v5.0 or should I be running LTS 4.2.x? How do I figure that out?

and both had a similar response, in a nutshell:
> Day to day I am using Node v5.0 but if I were deploying a server I would use the LTS(4.2.4) just because having that stability. - Rebecca

This is exactly why I upgraded to 4.2.4 instead of 5.0 but to make more sense of it you have to listen to whole answer in the podcast itself: [NodeUp 96](http://nodeup.com/ninetysix). It is awesome.

##Using NVM
Using `nvm` makes the whole process much easier but it also has its own issues, for instance in linux systems one of the famous issues of using `nvm` is the issue when using `sudo` to install global packages which could be fixed easily but still is an issue.   
To install `nvm` you could follow the instruction in its [Github repository](https://github.com/creationix/nvm), which has a [install script](https://github.com/creationix/nvm/blob/v0.30.1/install.sh) the you could easily download using `curl` or `wget` and run with `bash`.  
Now to upgrade or to install node using `nvm` all you should do is: `nvm install 4.2.4` and then `nvm use 4.2.4`.
That is how I upgraded my node on my local machine.

##Using N
I really like `nvm` BUT I used `n` on my production servers which to me sounds more reliable and has a much easier installation process and so far I haven't seen any of the issues I have had with `nvm`. That's how I upgraded my servers:

    sudo npm cache clean -f
    sudo npm install -g n
    sudo n 4.2.4
    sudo ln -sf /usr/local/n/versions/node/4.2.4/bin/node /usr/bin/node
    
and it was all I should do. Of course next time I no longer need to install `n` itself.

##What about npm 3?
Using npm 3, your dependencies will be installed flat - by default, and there is no doubt that, IMHO, it is a huge improvement. The great thing about npm that I really like is how easy I could upgrade it using its own install command:

    sudo npm install -g npm

and done.
