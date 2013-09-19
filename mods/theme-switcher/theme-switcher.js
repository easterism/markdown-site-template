
(function() { "use strict";
    
    var all_themes =
    {
        'bootstrap-theme':'Bootstrap Default',
//        'cerulian-theme':'Bootswatch: Cerulian',
//        'cosmo-theme':'Bootswatch: Cosmo',
//        'cyborg-theme':'Bootswatch: Cyborg',
//        'flatly-theme':'Bootswatch: Flatly',
//        'journal-theme':'Bootswatch: Journal',
//        'readable-theme':'Bootswatch: Readable',
//        'simplex-theme':'Bootswatch: Simplex',
//        'slate-theme':'Bootswatch: Slate',
//        'spacelab-theme':'Bootswatch: Spacelab',
//        'united-theme':'Bootswatch: United',
        'msdn-like-theme':'MSDN-like'
    };
    
    try { /*not work in IE on file:// */ $DOC.primaryTheme = localStorage.getItem('primary-theme'); } catch (e) {}
    if (!all_themes[$DOC.primaryTheme])
        $DOC.primaryTheme = 'msdn-like-theme';
    $DOC.mod('primary-theme', $DOC.primaryTheme);
    

    $DOC.selectPrimaryTheme = function (theme) {
        if (theme !== $DOC.primaryTheme) {
            $DOC.removeMod('primary-theme');
            if (all_themes[theme]) {
                $DOC.mod('primary-theme', theme);
                $DOC.primaryTheme = theme;
                try { /*not work in IE on file:// */ localStorage.setItem('primary-theme', theme); } catch (e) {}
            } else {
                $DOC.mod('primary-theme', 'msdn-like-theme');
                $DOC.primaryTheme = 'msdn-like-theme';
                try { /*not work in IE on file:// */ localStorage.setItem('primary-theme', 'msdn-like-theme'); } catch (e) {}
            }
        }
    };
    
    // FIX: IE browser does not support localStorage
    if (this.localStorage)
    
    $DOC.events.load.addListener('load', function()
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
                        $DOC.selectPrimaryTheme(theme);
                    });
                });

                ul.append(menuitem.outerHTML());
                menuitem.attachAll();
            });
        }
    });
}).call(this);