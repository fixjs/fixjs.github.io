---
layout: page
title: JavaScript daily trends ...
tagline: JavaScript
---
{% include JB/setup %}
<ul class="entries">
{% for post in site.posts limit:10 %}
  <li>
    <p>
    	<a href="{{ post.url }}">
	    <h2>{{ post.title }}</h2>
	    </a>
	    <br />
	    <div>{{ post.content |truncatehtml | truncatewords: 200 }}</div>
    </p>
  </li>
{% endfor %}
</ul>