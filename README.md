# Dynamic Search with Jekyll

Since jekyll generates static sites, having dynamic search is nearly impossible without using a third-party service of some kind. This project aims to fix that, by using a jekyll plugin to generate a full-text index of your site that can be searched against via a jQuery script. 

# Requirements

Ruby Gems:
* JSON
* Ferret (indexing)

JQuery &gt;= 1.6	

# Caveats

If you're running jekyll in safe mode (ie. Github's pages), you'll need to generate the search.json before you push your pages up. 

# Example

Add jQuery and the search.js script:

<pre>
&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/scripts/search.js"&gt;&lt;/script&gt;
</pre>

Add a search box and button:

<pre>
&lt;div id="searchdiv"&gt;
 &lt;input id="searchbox" class="search" type="text" /&gt;
 &lt;input id="searchbutton" class="search" type="button" value="search" onclick="javascript:doSearch();" /&gt;
&lt;/div&gt;
</pre>

Add a little more javascript to display the results:

<pre>
function doSearch() {
  results = run_search();
  &lt;.. do something ..&gt;
}
</pre>
