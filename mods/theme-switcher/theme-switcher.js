
(function() { "use strict";
    
    var all_themes = {'bootstrap-theme':'Bootstrap', 'msdn-like-theme':'MSDN-like'};
    try { /*not work in IE on file:// */ $$DOCUMENT.primaryTheme = localStorage.getItem('primary-theme'); } catch (e) {}
    if (!all_themes[$$DOCUMENT.primaryTheme])
        $$DOCUMENT.primaryTheme = 'msdn-like-theme';
    $$DOCUMENT.mod('primary-theme', $$DOCUMENT.primaryTheme);
    

    $$DOCUMENT.selectPrimaryTheme = function (theme) {
        if (theme !== $$DOCUMENT.primaryTheme) {
            $$DOCUMENT.removeMod('primary-theme');
            if (all_themes[theme]) {
                $$DOCUMENT.mod('primary-theme', theme);
                $$DOCUMENT.primaryTheme = theme;
                try { /*not work in IE on file:// */ localStorage.setItem('primary-theme', theme); } catch (e) {}
            } else {
                $$DOCUMENT.mod('primary-theme', 'msdn-like-theme');
                $$DOCUMENT.primaryTheme = 'msdn-like-theme';
                try { /*not work in IE on file:// */ localStorage.setItem('primary-theme', 'msdn-like-theme'); } catch (e) {}
            }
        }
    };
    
    // FIX: IE browser does not support localStorage
    if (this.localStorage)
    
    $$DOCUMENT.events.load.addListener('load', function()
    {
        var ul = $('.fixed-top-navbar ul').first();
        if (ul) {
            var menuitem = controls.create('li', {class:'dropdown'});
            menuitem.add('a', {class:'dropdown-toggle', 'data-toggle':'dropdown', $text:'Mods<b class="caret"></b>', href:'#'});
            menuitem.add('ul', {class:'dropdown-menu'}, function(modslist)
            {
                Object.keys(all_themes).forEach(function(theme)
                {
                    modslist.add('li')
                    .add('a', {$text:all_themes[theme]})
                    .listen('click', function()
                    {
                        $$DOCUMENT.selectPrimaryTheme(theme);
                    });
                });

                ul.append(menuitem.outerHTML());
                menuitem.attachAll();
            });
        }
    });
}).call(this);