# Dynamic Search with Jekyll

Since jekyll generates static sites, having dynamic search is nearly impossible without using a third-party service of some kind. This project aims to fix that, by using a jekyll plugin to generate a full-text index of your site that can be searched against via a jQuery script. 

# License

This project is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

# Requirements

Ruby Gems:
* JSON
* Ferret (indexing)

JQuery >= 1.6	

# Caveats

If you're running jekyll in safe mode (ie. Github's pages), you'll need to generate the search.json before you push your pages up. 

# Example

Generate the search.json file by adding the gensearch.rb file to your plugins and running jekyll:

```bash
$ jekyll 
Configuration from /path/to/your/site/_config.yml
Building site: /path/to/your/site -> ./_site
Generating search data for 4022 words
Successfully generated site: /path/to/your/site -> ./_site

$ ls -lh search.json 
-rw-r--r--. 1 root root 330K Jun 20 16:30 search.json
```

My site is currently that many words (across a few hundred pages), resulting in a search index approximately 1/3 MB.

Add jQuery and the search.js script:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="/scripts/search.js"></script>
```

Add a search box and button:

```html
<div id="searchdiv">
 <input id="searchbox" class="search" type="text" />
 <input id="searchbutton" class="search" type="button" value="search" onclick="javascript:doSearch();" />
</div>
```

Add a little more javascript to display the results (results are stored in the `final_results` global var):

```javascript
function doSearch() {
  run_search(function() {
    //.. do something ..
    for (var i = 0, len = final_results.length; i < len; i++) {
      console.log(final_results[i].u + ': ' + final_results[i].t);
    }
  });
}
```

The run_search function takes a callback, which is run if the AJAX call is successful.
