
$DOC.mod('theme-switcher');

// example of using $DOC.parseContent function to create sections
$DOC.parseContent(function(){/*

<!--fixed-top-bar
%navbar(
[Home]({{=$DOC.root}}index.html)
***
* [Docs]({{=$DOC.root}}index.html)
 * [Blog]({{=$DOC.root}}blog.html)
 * [Layout]({{=$DOC.root}}docs/layout.html)
 * [CML (Component Markdown Language)]({{=$DOC.root}}docs/CML.html)
 * [URL parameters]({{=$DOC.root}}docs/url-parameters.html)
 * [API]({{=$DOC.root}}docs/api.html)
* [Components]({{=$DOC.root}}index.html)
 * [CSS]({{=$DOC.root}}components/controls.css.html)
 * [Alert]({{=$DOC.root}}components/controls.alert.html)
 * [Panel]({{=$DOC.root}}components/controls.panel.html)
 * [Collapse]({{=$DOC.root}}components/controls.collapse.html)
 * [Tabbed panel]({{=$DOC.root}}components/controls.tabpanel.html)
 * [Carousel]({{=$DOC.root}}components/controls.carousel.html)
 * [Page layout]({{=$DOC.root}}components/controls.page-layout.html)
 * [Emoji]({{=$DOC.root}}components/controls.emoji.html)
 * [YouTube Player]({{=$DOC.root}}components/YouTube.Player.html)
 * [Mediawiki markup]({{=$DOC.root}}components/wiki.instaview.html)
 * [MathJax]({{=$DOC.root}}components/controls.math.html)
 * [Google Charts]({{=$DOC.root}}components/gcharts/Google%20Charts.html)
 * [d3js.org]({{=$DOC.root}}components/d3/d3.html)
)%navbar
-->

<!--header-panel

# Markdown webdocs
### Simple Markdown site template

-->

*/});

// another example of creating a named section
$DOC.sections['footer-panel'] =
'%footer-layout#scheme=line(\
* © 2013 [aplib on GitHub](https://github.com/aplib/markdown-site-template) MIT\n\
***\n\
* [Free download template from GitHub](http://aplib.github.io/markdown-site-template/markdown-site-template.zip)\
)%footer-layout';
