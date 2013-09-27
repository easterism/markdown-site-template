
$DOC.mod('theme-switcher');

// example of using $DOC.parseContent function to create sections
$DOC.parseContent(function(){/*

<!--fixed-top-bar
%navbar(
[Home]({{=$DOC.root}}index.html)
***
* [Docs]({{=$DOC.root}}index.html)
 * [Blog]({{=$DOC.root}}blog.html)
 * [Layout]({{=$DOC.root}}layout.html)
 * [CML (Component Markdown Language)]({{=$DOC.root}}CML.html)
* [Components]({{=$DOC.root}}index.html)
 * [CSS]({{=$DOC.root}}components/controls.css.html)
 * [Alert]({{=$DOC.root}}components/controls.alert.html)
 * [Panel]({{=$DOC.root}}components/controls.panel.html)
 * [Collapse]({{=$DOC.root}}components/controls.collapse.html)
 * [Tabbed panel]({{=$DOC.root}}components/controls.tabpanel.html)
 * [Carousel]({{=$DOC.root}}components/controls.carousel.html)
 * [Page layout]({{=$DOC.root}}components/controls.page-layout.html)
 * [Emoji]({{=$DOC.root}}components/GitHub.gemoji.html)
 * [YouTube Player]({{=$DOC.root}}components/YouTube.Player.html)
 * [Mediawiki markup]({{=$DOC.root}}components/wiki.instaview.html)
 * [MathJax]({{=$DOC.root}}components/controls.math.html)
 * [Google Charts]({{=$DOC.root}}components/gcharts/Google Charts.html)
 * [d3js.org]({{=$DOC.root}}components/d3/d3.html)
)%navbar
-->

<!--header-panel

# Markdown webdocs
### Simple Markdown site template

-->

*/});

// another example of creating a page section
$DOC.sections['footer-panel'] =
'* © 2013 [aplib on GitHub](https://github.com/aplib/markdown-site-template) MIT\n\
* [Free download template from GitHub](http://aplib.github.io/markdown-site-template/markdown-site-template.zip)';




 // marked.js support GitHub Flavored Markdown see on https://github.com/chjj/marked/wiki
 // For enable GitHub Flavored Markdown uncommented next options code lines:
 // Set default options except highlight which has no default
 $ENV.marked.setOptions({
   gfm: true,
 //  highlight: function (code, lang, callback) {
 //    pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
 //      if (err) return callback(err);
 //      callback(null, result.toString());
 //    });
 //  },
   tables: true,  breaks: false,  pedantic: false,  sanitize: false,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
 });
