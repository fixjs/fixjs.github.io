---
layout: default
title: JavaScript daily trends ...
---
{% include JB/setup %}

{% for post in site.posts %}
<div class="blog-index">
  {% assign content = post.content %}
  {% include post_detail.html %}
</div>
{% endfor %}