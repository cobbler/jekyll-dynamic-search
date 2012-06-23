/*
Copyright (c) 2012 by James Cammarata <jimi@sngx.net>

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// flag for searching, to help prevent multiple concurrent searches
var searching = false;
// results of search, stored globaly
var final_results = [];

// helper function, enables/disables anything with 
// the class "search" so people don't double tap
function set_search_enabled(enabled) {
  $(".search").prop("disabled",!enabled);
}

// helper function, gets the keys from a hash 
// and dumps them into an array
function getkeys(obj) {
    var keys = [];
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

function run_search(search_callback) {
  if (!searching && $.trim($("#searchbox").val()) != "") {
    // don't let multiples run at the same time
    searching = true;
    // clear the final results variable
    final_results = [];
    // disable the input/button 
    set_search_enabled(false);
    // and go...
    $.getJSON('/search.json', function(data,status) {

      var s_words = $.trim($("#searchbox").val()).toLowerCase().split(" ");
      var results = {};

      // now loop through all the words in the search JSON...
      $.each(getkeys(data["words"]), function(idx,key) {
        // for each word we're looking for
        $.each(s_words, function(idx,val) {
          // "fuzzy" matching logic with match and regex, 
          // but only if the key is 3 or more characters
          var s_reg = val;
          if (val.length > 2) {
            try {
              s_reg = new RegExp(val.split('').join('\\w*').replace(/\W/, ""), 'i');
            } catch(e) { 
              // just use the raw string for the match below.
              // this block gets hit if some enters a search like
              // "word*"
            }
          }
          if (key.match(s_reg)) { 
            // we have a "match", so now we take all of the indexed
            // documents for that word and save them into our results,
            // adding to the original score if this document was already
            // found through another word.
            $.each(data["words"][key],function(widx,wobj) {
              // "u" is the ferret-based id, which is an index into 
              // the "index" hash table in our data
              var id = wobj["u"];
              if (data["index"][id]) {
                if (!results[id]) {
                  results[id] = {}
                  results[id]["s"] = 0.0;                    // the score
                  results[id]["t"] = data["index"][id]["t"]; // the title
                  results[id]["u"] = data["index"][id]["u"]; // the url
                }

                // As stated above, add the score for this word/document 
                // to this results total score
                //
                // TODO: adjust the score based on how fuzzy the result was?
                results[id]["s"] += parseFloat(wobj["s"]);
              }
            });
          }
        });
      });

      // get all the keys from the results
      var keys = [];
      $.each(results, function(key,val) {
        keys.push(key);
      });

      // sort keys high to low based on the score, or
      // alphabetically in the event of a tie score
      keys.sort(function(a,b) {
         var res = results[b]["s"] - results[a]["s"];
         if (res == 0.0) {
            return (results[a]["t"] > results[b]["t"]) ? 1 : ( (results[b]["t"] > results[a]["t"]) ? -1 : 0 );
         } else {
            return res;
         }
      });

      // fill up the array of results with the entries
      // with the highest scores first
      $.each(keys, function(idx,key) {
        final_results.push(results[key]);
      });

      // run the callback function
      search_callback()
    }).success(function() {
    }).error(function() { 
    }).complete(function() { 
      // all done and all clear
      searching = false;
      set_search_enabled(true);
    });
  }
}
