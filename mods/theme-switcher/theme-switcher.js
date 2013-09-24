
(function() { "use strict";
    
    var all_themes =
    {
        '':'Bootstrap Default',
        'amelia-theme':'Bootswatch: Amelia',
        'cerulian-theme':'Bootswatch: Cerulian',
        'cosmo-theme':'Bootswatch: Cosmo',
        'cyborg-theme':'Bootswatch: Cyborg',
        'flatly-theme':'Bootswatch: Flatly',
        'journal-theme':'Bootswatch: Journal',
        'readable-theme':'Bootswatch: Readable',
        'simplex-theme':'Bootswatch: Simplex',
        'slate-theme':'Bootswatch: Slate',
        'spacelab-theme':'Bootswatch: Spacelab',
        'united-theme':'Bootswatch: United',
        'msdn-like-theme':'MSDN-like'
    };
    
    if (!all_themes[$DOC.theme])
        $DOC.theme = undefined;
    
    // check browser support localStorage
    if (typeof localStorage !== 'undefined') {
        if ($DOC.isLoaded)
            create_mods_dropdown();
        else
            $DOC.events.load.addListener('load', create_mods_dropdown);
    }
    
    // add Mods submenu
    function create_mods_dropdown()
    {
        var ul = $('.navbar-collapse > ul').first();
        if (ul) {
            // create mods submenu
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
                        $DOC.theme = theme;
                    });
                });

                ul.append(menuitem.outerHTML());
                menuitem.attachAll();
            });
        }
    }
    
}).call(this);