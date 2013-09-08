
$$DOCUMENT.mod('theme-switcher');

// example of using $$DOCUMENT.parseContent function to create sections
$$DOCUMENT.parseContent(function(){/*

<!--fixed-top-navbar

* [Home]({{=$$DOCUMENT.root}}index.html)
* [Layout]({{=$$DOCUMENT.root}}layout.html)
* [Components]({{=$$DOCUMENT.root}}index.html)
 * [CSS]({{=$$DOCUMENT.root}}components/controls.css.html)
 * [Alert]({{=$$DOCUMENT.root}}components/controls.alert.html)
 * [Tabbed panel]({{=$$DOCUMENT.root}}components/controls.tabpanel.html)
 * [Emoji]({{=$$DOCUMENT.root}}components/GitHub.gemoji.html)
 * [YouTube Player]({{=$$DOCUMENT.root}}components/YouTube.Player.html)
 * [Mediawiki markup]({{=$$DOCUMENT.root}}components/wiki.instaview.html)
 
-->

<!--header

# Simple Markdown site template
###Incredible simple but powerful site template

-->

*/});

// another example of creating a page section
$$DOCUMENT.sections.footer =
'* © 2013 [aplib on GitHub](https://github.com/aplib/markdown-site-template) MIT\n\
* [Free download template from GitHub](http://aplib.github.io/markdown-site-template/markdown-site-template.zip)';




// // marked.js support GitHub Flavored Markdown see on https://github.com/chjj/marked/wiki
// // For enable GitHub Flavored Markdown uncommented next options code lines:
// // Set default options except highlight which has no default
// marked.setOptions({
//   gfm: true,
// //  highlight: function (code, lang, callback) {
// //    pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
// //      if (err) return callback(err);
// //      callback(null, result.toString());
// //    });
// //  },
//   tables: true,  breaks: false,  pedantic: false,  sanitize: true,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
// });