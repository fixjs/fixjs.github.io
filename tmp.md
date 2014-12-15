<h1>Latest Post</h1>
{% assign post = site.posts.last %}
<p>
	<a href="{{ post.url }}">
    <h2>{{ post.title }}</h2>
    </a>
    <br />
    <div>{{ post.content |truncatehtml | truncatewords: 200 }}</div>
</p>
<hr />
{% for post in site.posts%}
<p>
	<a href="{{ post.url }}">
    <h2>{{ post.title }}</h2>
    </a>
</p>
<hr />
{% endfor %}