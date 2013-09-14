
$$DOC.mod('theme-switcher');

// example of using $$DOC.parseContent function to create sections
$$DOC.parseContent(function(){/*

<!--fixed-top-navbar

* [Home]({{=$$DOC.root}}index.html)
* [Layout]({{=$$DOC.root}}layout.html)
* [Components]({{=$$DOC.root}}index.html)
 * [CSS]({{=$$DOC.root}}components/controls.css.html)
 * [Alert]({{=$$DOC.root}}components/controls.alert.html)
 * [Panel]({{=$$DOC.root}}components/controls.panel.html)
 * [Collapse]({{=$$DOC.root}}components/controls.collapse.html)
 * [Tabbed panel]({{=$$DOC.root}}components/controls.tabpanel.html)
 * [Carousel]({{=$$DOC.root}}components/controls.bs-carousel.html)
 * [Emoji]({{=$$DOC.root}}components/GitHub.gemoji.html)
 * [YouTube Player]({{=$$DOC.root}}components/YouTube.Player.html)
 * [Mediawiki markup]({{=$$DOC.root}}components/wiki.instaview.html)
 * [MathJax]({{=$$DOC.root}}components/controls.math.html)
 
-->

<!--header

# Simple Markdown site template
###Incredible simple but powerful site template

-->

*/});

// another example of creating a page section
$$DOC.sections.footer =
'* © 2013 [aplib on GitHub](https://github.com/aplib/markdown-site-template) MIT\n\
* [Free download template from GitHub](http://aplib.github.io/markdown-site-template/markdown-site-template.zip)';




 // marked.js support GitHub Flavored Markdown see on https://github.com/chjj/marked/wiki
 // For enable GitHub Flavored Markdown uncommented next options code lines:
 // Set default options except highlight which has no default
 $$ENV.marked.setOptions({
   gfm: true,
 //  highlight: function (code, lang, callback) {
 //    pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
 //      if (err) return callback(err);
 //      callback(null, result.toString());
 //    });
 //  },
   tables: true,  breaks: false,  pedantic: false,  sanitize: false,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
 });

// #605 Next code is not template, only for http://aplib.github.io/ 
$$DOC.appendScript('ga',
' (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){\
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\
  })(window,document,"script","//www.google-analytics.com/analytics.js","ga");\
  ga("create", "UA-43570333-1", "aplib.github.io");ga("send", "pageview");') ;
