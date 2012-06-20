# Dynamic Search with Jekyll

Since jekyll generates static sites, having dynamic search is nearly impossible without using a third-party service of some kind. This project aims to fix that, by using a jekyll plugin to generate a full-text index of your site that can be searched against via a jQuery script. 

# Requirements

Ruby Gems:
* JSON
* Ferret (indexing)

JQuery >= 1.6	

# Caveats

If you're running jekyll in safe mode (ie. Github's pages), you'll need to generate the search.json before you push your pages up. 

# Example

Add jQuery and the search.js script:

{% highlight html %}
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/scripts/search.js"></script>
{% endhighlight %}

Add a search box and button:

{% highlight html %}
<div id="searchdiv">
 <input id="searchbox" class="search" type="text" />
 <input id="searchbutton" class="search" type="button" value="search" onclick="javascript:doSearch();" />
</div>
{% endhighlight %}

Add a little more javascript to display the results:

{% highlight javascript %}
function doSearch() {
  results = run_search();
  <.. do something ..>
}
{% endhighlight %}
