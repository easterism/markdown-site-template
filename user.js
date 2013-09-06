
$$DOCUMENT.mod('theme-switcher');

// example of using $$DOCUMENT.parseContent function to create sections
$$DOCUMENT.parseContent(function(){/*

<!--fixed-top-navbar

* [Home]({{=$$DOCUMENT.root}}index.html)
* [Layout]({{=$$DOCUMENT.root}}layout.html)
* [Components]({{=$$DOCUMENT.root}}index.html)
 * [CSS]({{=$$DOCUMENT.root}}components/controls.css.html)
 * [Alert]({{=$$DOCUMENT.root}}components/controls.alert.html)
 * [Emoji]({{=$$DOCUMENT.root}}components/GitHub.gemoji.html)
 * [YouTube Player]({{=$$DOCUMENT.root}}components/YouTube.Player.html)

-->

<!--header

# Simple Markdown site template
###Incredible simple but powerful site template

-->

*/});


// another example of creating a page section
$$DOCUMENT.sections.header =
'# Simple Markdown site template\n\
###Incredible simple but powerful site template';


// example of defining global variable for  <!--page-footer {{=footer}}-->  interpolation
var footer =
'* © 2013 [aplib](https://github.com/aplib/markdown-site-template) MIT\n\
* simple markdown site template by aplib [on GitHub](https://github.com/aplib/markdown-site-template)';




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