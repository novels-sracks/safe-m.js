// safe-m.js  (minimal image helper, NO backlinks, NO external bad calls)
(function(){
  'use strict';

  // helper: get first img src from HTML snippet
  function firstImageFromHtml(html){
    if(!html) return '';
    try{
      var d = document.createElement('div');
      d.innerHTML = html;
      var img = d.querySelector('img');
      return img ? img.getAttribute('src') : '';
    }catch(e){
      return '';
    }
  }

  // normalize blogger urls that start with //  => add https:
  function absUrl(u){ if(!u) return ''; return u.indexOf('//')===0 ? 'https:' + u : u; }

  // Public helper: find thumbnail for a post entry object (Blogger feed entry)
  window.safeGetPostImage = function(entry){
    var BLANK = 'https://resources.blogblog.com/img/blank.gif';
    if(!entry) return BLANK;
    var thumb = entry.media$thumbnail && entry.media$thumbnail.url ? entry.media$thumbnail.url : '';
    var content = (entry.content && entry.content.$t) ? entry.content.$t : (entry.summary && entry.summary.$t ? entry.summary.$t : '');
    var first = firstImageFromHtml(content);
    if(first) return absUrl(first);
    if(thumb) return absUrl(thumb);
    return BLANK;
  };

  // small utility to update elements with data-image attr -> set background-image or <img>
  window.safeApplyThumbnails = function(){
    document.querySelectorAll('[data-image]').forEach(function(el){
      var url = el.getAttribute('data-image') || '';
      if(!url) return;
      url = absUrl(url);
      if(el.tagName.toLowerCase() === 'img') el.src = url;
      else el.style.backgroundImage = 'url("'+url+'")';
    });
  };

  // auto-apply on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(window.safeApplyThumbnails, 200); });

})();
