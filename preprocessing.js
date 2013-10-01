if (!$ENV) {
    
    
$ENV =
{
    dot: require('./temp/dot'),
    controls: require('controls'),
    marked: require('./temp/marked'),
    'bootstrap.controls': require('./temp/bootstrap.controls.js')
};


(function() { 'use strict';
    
    // initialize $ENV
    
    // marked patches
    var marked = $ENV.marked;
    // Set default options except highlight which has no default
    marked.setOptions({
      gfm: true, tables: true,  breaks: false,  pedantic: false,  sanitize: false,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
    });
    $ENV.markedPostProcess = function(text, options) {
        var formatted = marked(text, options);
        return formatted;
        // experimental patch return (formatted.substr(0,3) === '<p>' && formatted.slice(-5) === '</p>\n') ? formatted.substr(3, formatted.length-8) : formatted;
    };
    
    // default control templates
    $ENV.default_template = function(it)
    {
        return '<div' + it.printAttributes() + '>' + $ENV.markedPostProcess( (it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("") ) + '</div>';
    };
    $ENV.default_inner_template = function(it)
    {
        return $ENV.markedPostProcess( (it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("") );
    };
    
    // #log-level=?
    var hash = window.location.hash;
    var log_level_pos = hash.indexOf('log-level=');
    if (log_level_pos >= 0) {
        console.log('>document: "' + window.location.href + '"');
        $ENV.log_level = parseInt(hash[log_level_pos + 10]);
    }
    
    
    // initialize $DOC
    
    var scripts_count = 0, scripts_stated = 0, transformation_started;
    function check_all_script() {
        // document transformation start after the scripts loaded or failed
        var transformation = $DOC.transformation;
        if (scripts_count === scripts_stated && !transformation_started && transformation) {
            transformation_started = true;
            transformation();
        }
    }
    
    $DOC =
    {
        options: {},
                
        // State
        state: 0, // 0 - started, 1 - transformation started, 2 - loaded, -1 - broken
        isLoaded: false,
                
        // Document events - 'load'
        events: {},
        forceEvent: function(name) {
            var events = this.events;
            if (!events.hasOwnProperty(name))
                events[name] = new controls.Event();
            return events[name];
        },
        onload: function(handler) { this.forceEvent('load').addListener(handler); },
                
        // Document named sections content
        sections: {},
        // Sections constants
        ORDER: ['fixed-top-bar', 'fixed-top-panel',
            'header-bar', 'header-panel',
            'left-side-bar', 'left-side-panel',
            'content-bar', 'content-panel',
            'right-side-panel', 'right-side-bar',
            'footer-panel', 'footer-bar',
            'fixed-bottom-panel', 'fixed-bottom-bar'],
        COLUMNS: ['left-side-bar', 'left-side-panel', 'content-bar', 'content-panel', 'right-side-panel', 'right-side-bar'],
        addSection: function(name, value) {
            var sections = this.sections, exists = sections[name];
            if (exists) {
                if ($ENV.log_level) console.log('>' + name + ' overriden!');
                if (exists._element)
                    exists.deleteElement();
            }
            sections[name] = value;
        },
        removeSection: function(name) {
            var sections = this.sections, exists = sections[name];
            if (exists) {
                if (exists._element)
                    exists.deleteElement();
                sections[name] = undefined;
            }
        },
        // move section to placeholder location
        sectionPlaceholder: function(name, text_node) {
            var sections = this.sections,
                exists = sections[name];
            // move exists node
            if (exists) {
                if (exists.__type) {
                    var element = exists.element;
                    if (element)
                        document.insertBefore(element, text_node);
                } else if (exists.nodeType) {
                    document.insertBefore(exists, text_node);
                }
            }
            sections[name] = {placeholder:text_node, content:exists};
        },
        // move section to other location
        sectionMover: function(text_node, oldname, newname) {
            var sections = this.sections,
                exists = sections[oldname];
            if (typeof exists === 'string') {
                sections[newname] = exists;
                delete sections[oldname];
            } else if (exists) {
                if (exists.__type) {
                    exists.class(newname, oldname);
                    var element = exists.element;
                    if (element)
                        document.insertBefore(element, text_node);
                } else if (exists.nodeType) {
                    document.insertBefore(exists, text_node);
                }
            }
        },
        // Texts and templates
        vars: {},
        // Document data access

        // parse content values from text or from function text
        parseContent:
            function(name /*name optional*/, content) {

                if (!name)
                    return;

                var found_content = false;

                if (arguments.length === 1) {
                    var frags = name.toString().split(/(<!--\S+\s+)|(-->)/gm);
                    for(var i = 0, c = frags.length; i < c; i+=1) {
                        var test = frags[i];
                        if (test && test.substr(0,4) === '<!--') {
                            // first '$' - var else section
                            if (test[4] === '$') {
                                // as var
                                var varname = test.substr(4).trim();
                                this.vars[varname] = frags[i+2];
                            } else {
                                // as section
                                var section = test.substr(4).trim();
                                this.addSection(section, frags[i+2]);
                            }
                            found_content = true;
                            i += 2;
                        }
                    }
                }
                // for delete
//                else if (arguments.length > 1) {
//
//                    if (typeof(content) === 'function') {
//                        var content = content.toString(), asterpos = content.indexOf('*'), lastpos = content.lastIndexOf('*');
//                        content = content.substr(asterpos + 1, lastpos - asterpos - 1);
//                    }
//                    // first '$' - var else section
//                    if (name[0] === '$')
//                        this.vars[name] = content;
//                    else
//                        this.addSection(name, content);
//
//                    found_content = true;
//                }
                return found_content;
            },

        filters: [],
        
        // append to head
        appendElement: function(id, tag, attributes) {
            try {
                if (arguments.length < 3) { attributes = tag; tag = id; id = undefined; }
                var head = document.head;
                if (id) {
                    var element = document.getElementById(id);
                    if (element && element.parentNode === head)
                        return;
                }
                head.insertAdjacentHTML('beforeend',
                    '<' + tag + (id ? (' id="'+id+'"') : '') + Object.keys(attributes).map(function(prop){return' '+prop+'="'+attributes[prop]+'"';}).join('') + '></' + tag + '>');
                return head.lastChild;
            } catch(e) { console.log(e); }
        },
        // remove from head
        removeElement: function(id) {
            var element = document.getElementById(id);
            if (element && element.parentNode === document.head)
                document.head.removeChild(element);
        },
        // only sync scripts(?)
        appendScript: function(id, src, callback) {
            if (arguments.length === 1 || typeof src === 'function') { callback = src; src = id; id = undefined; }
            
            if (id && document.getElementById(id)) {
                // script already loaded
                if (callback)
                    callback(+1);
                return;
            }
            
            scripts_count++;
            var script = document.createElement('script');
            if (id)
                script.id = id;
            script.src = src;
            script.async = true; // no affects?
            script.addEventListener('load', function() {
                if (callback)
                    callback(+1);
                scripts_stated++;
                check_all_script();
            });
            script.addEventListener('error', function() {
                if (callback)
                    callback(-1);
                scripts_stated++;
                check_all_script();
            });
            document.head.appendChild(script);
        },
        appendCSS: function(id, css, callback) {
            var exists = document.getElementById(id),
                israwcss = (css.indexOf('{') >= 0);
            if (!exists) {
                if (israwcss) {
                    document.head.insertAdjacentHTML('beforeend', '<style id="' + id + '" auto="true">' + css + '</style>');
                } else {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.id = id;
                    link.auto = true;
                    link.href = css;
                    if (callback) {
                        link.addEventListener('load', function() { callback(1); });
                        link.addEventListener('error', function() { callback(-1); });
                    }
                    document.head.appendChild(link);
                }
            } else if (israwcss && exists.innerHTML !== css)
                exists.innerHTML = css;
        },
        
        mods: {},
        mod: function(group, names) {
            if (arguments.length === 1)
                names = group;
            var mod_group = $DOC.mods[group];
            if (!mod_group) {
                mod_group = [];
                $DOC.mods[group] = mod_group;
            }
            names.split(/ ,;/g).forEach(function(name) {
                if (mod_group.indexOf(name) < 0) {
                    var path = $DOC.root + 'mods/' + name + '/' + name;
                    $DOC.appendCSS(group + '-' + name + '-css', path + '.css');
                    $DOC.appendScript(group + '-' + name + '-js', path + '.js');
                    mod_group.push(name);
                }
            });
        },
        removeMod: function(group, names) {
            var mod_group = $DOC.mods[group];
            if (mod_group) {
                ((arguments.length === 1) ? mod_group : names.split(/ ,;/g)) .forEach(function(name) {
                    var index = mod_group.indexOf(name);
                    if (index >= 0) {
                        $DOC.removeElement(group + '-' + name + '-css');
                        $DOC.removeElement(group + '-' + name + '-js');
                        mod_group.splice(index, 1);
                    }
                });
            }
        }
    };
    
    
    // Path
    // root - document folder root path, preferred relative
    // executing - document.js path
    // index - document index file
    // components - codebase start path
    
    
    var nodes = document.head.childNodes, meta_root, meta_index, param_root, param_index, src_root, src_index;
    for(var i = 0, c = nodes.length; i < c && !meta_root; i++) {
        var node = nodes[i];
        if (node.nodeType === 1)
        switch(node.tagName.toLowerCase()) {
            
            case 'meta':
                meta_root = node.getAttribute('root');
                meta_index = node.getAttribute('index');
                
                if (meta_index) {
                    var milowercase = meta_index.toLowerCase();
                    if ((meta_index.slice(-1) === '/' || meta_index === meta_root)
                    && (!milowercase.indexOf('.php') && !milowercase.indexOf('.htm') && !milowercase.indexOf('.html'))) {
                        if (meta_index.slice(-1) !== '/')
                            meta_index += '/';
                        meta_index += 'index.html';
                    }
                }
                if (meta_index && !meta_root)
                    meta_root = meta_index.split('/').slice(0, -1);
                break;
                
            case 'script': if (node.src) {
                var src = node.getAttribute('src'),
                    docpos = src.indexOf('document.');
                // it is a document. script element
                if (docpos >= 0) {
                    var qpos = src.indexOf('#') || src.indexOf('?');
                    if (qpos >= 0)
                    src.slice(qpos+1).split('&').forEach(function(param)
                    {
                        if (param.slice(0,5)==='root=')         param_root = param.slice(5);
                        else if (param.slice(0,6)==='index=')   param_index = param.slice(6);
                    });
                    
                    // if not an absolute path
                    if (src.indexOf('//') < 0) {
                        src_root = src.slice(0, docpos);
                    }
                }
            }
        }
    }
    
    var root = $DOC.root || meta_root || param_root || src_root || '',
        index = $DOC.index || meta_index || param_index || root + 'index.html',
        js,components;
        
    var current = document.currentScript;
    if (!current) {
        var scripts = document.getElementsByTagName('script');
        for(var i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i];
            if (script.src.indexOf('document.') >= 0 && ' complete interactive'.indexOf(script.readyState) > 0)
                current = script;
        }
    }
    var js = current && current.src;
    if (js) {
        // components is always loaded from path of the executing script
        components = js.split('/').slice(0, -1).concat(['components/']).join('/');
    }
    
    // selected theme
    var theme = '', theme_confirmed;
    if (typeof localStorage !== 'undefined') {
        
        theme = localStorage.getItem('primary-theme');
        theme_confirmed = localStorage.getItem('primary-theme-confirmed');
        
        if (hash) {
            
            // apply theme 'theme=' command
            var apply_theme = hash.match(/(^|;|,|&|#)theme=(.*)$|;|,|&/);
            if (apply_theme) {
                apply_theme = apply_theme[2];
                if (apply_theme !== theme) {
                    theme = apply_theme;
                    theme_confirmed = '';
                }
            }

            // switch theme 'settheme=' command

            var set_theme = hash.match(/(^|;|,|&|#)settheme=(.*)$|;|,|&/);
            if (set_theme) {
                set_theme = set_theme[2];
                if (set_theme !== theme) {
                    theme_confirmed = '';
                    localStorage.setItem('primary-theme-confirmed', '');
                }
                localStorage.setItem('primary-theme', apply_theme);
                theme = apply_theme;
            }
        }
    }
    
    Object.defineProperties($DOC, {
        root:       {value: root},
        executing:  {value: js},
        index:      {value: index},
        components: {value: components},
        theme: {
            get: function() { return theme; },
            set: function(value) {
                if (!value && value !== '')
                    value = '';
                if (value !== theme) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('primary-theme', value); 
                        window.location.reload();
                    }
                }
            }
        }
    });
    
    if ($ENV.log_level > 0)
        console.log('root,executing,index,components'.split(',').map(function(prop){return '>'+prop+': "'+$DOC[prop]+'"';}).join('\n'));
    
                
    $DOC.appendElement('meta', {name:'viewport', content:'width=device-width, initial-scale=1.0'});
    
    
    $DOC.appendCSS('document.css',
'.fixed-top-bar, .fixed-top-panel\
    { display: block; margin: 0; padding: 0; position: fixed; top: 0; left: 0; right: 0; z-index: 1030; }\
.fixed-top-panel\
    { background-color: inherit; padding: 25px 37px 0px 37px; margin-bottom: 25px; }\
.fixed-top-panel > .navbar\
    { margin: 0; }\
.header-bar, .header-panel\
    { display: block; margin: 0; padding: 0; }\
.header-panel\
    { padding: 25px 37px; }\
.footer-bar, .footer-panel\
    { display: block; margin: 0; padding: 0; }\
.footer-panel\
    { padding: 25px 37px; }\
.fixed-bottom-bar, .fixed-bottom-panel\
    { display: block; margin: 0; padding: 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1030; }\
.fixed-bottom-panel\
    { padding: 0px 37px 0px 37px; margin-top: 25px; }\
.fixed-bottom-panel > .navbar\
    { margin: 0; }\
.text-box\
    { width:50%; padding:25px 37px 25px 37px; display: inline-block; }\
.fixed-left-side-bar, .fixed-left-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: auto; position: fixed; top: 0; right: 0; bottom: 0; z-index: 1030; }\
.fixed-left-side-panel\n\
    { width: auto; padding:25px 20px; }\
.left-side-bar, .left-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: 26%; min-width: 240px; }\
.left-side-panel\
    { padding:25px 9px 25px 37px; }\
.content-bar, .content-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: 60%; min-width: 250px; max-width: 73%; }\
.content-panel\
    { padding:25px 37px 25px 37px; }\
.fixed-right-side-bar, .fixed-right-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: auto; position: fixed; top: 0; right: 0; bottom: 0; z-index: 1030;}\
.fixed-right-side-panel\
    { width: auto; padding:25px 20px;}\
.right-side-bar, .right-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; min-width: 240px; width: 28%;}\
.right-side-panel\
    { padding:25px 25px 25px 9px;}\
@media (max-width: 1024px) {\
    .right-side-bar, .right-side-panel\
        { display: block; padding:25px 25px 25px 37px; width: 50%; }\
    .right-side-panel\
        { padding:25px 25px 25px 37px; }\
}\
@media (max-width: 768px) {\
    .left-side-bar, .left-side-panel\
        { display: block; margin: 0; padding: 0; width: auto; }\
    .left-side-panel\
        { padding:25px 25px 25px 25px; }\
    .content-bar, .content-panel\
        { display: block; margin: 0; padding: 0; max-width: 100%; width: auto; }\
    .content-panel\
        { padding:25px 25px 25px 25px; }\
    .right-side-bar, .right-side-panel\
        { display: block; margin: 0; padding: 0; width: auto; }\
    .right-side-panel\
        { padding:25px 25px 25px 25px; }\
}\
.table-bordered\
    { display: table-cell; }\
.stub\
    { display: inline-block; }\
.stub-error\
    { width:18px; height:18px; border: silver dotted 1px; border-radius: 2px; }\
.stub-error:before\
    { content: "?"; font-size: small; color: silver; margin: 4px; position: relative; top: -2px; }\
\
.tabpanel-body\
    { padding-bottom: 5px; border-left: #DDD solid 1px; border-right: #DDD solid 1px; border-bottom: #DDD solid 1px;}\
.nav-tabs > li > a:focus\
    { outline-color: silver; }');

    if (!theme) {
        // load css on default theme
        $DOC.appendCSS('bootstrap.css', ($DOC.root.indexOf('aplib.github.io') >= 0)
            ? '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css' // load from CDN
            : $DOC.root + 'bootstrap.css'); // load from root
    } else {
        
        // load bootstrap.css before theme loading if theme loading was error
        if (!theme_confirmed)
        $DOC.appendCSS('bootstrap.css', ($DOC.root.indexOf('aplib.github.io') >= 0)
            ? '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css' // load from CDN
            : $DOC.root + 'bootstrap.css'); // load from root

        // theme loading and confirmed flag
        $DOC.appendCSS('theme.css', $DOC.root + 'mods/' + theme + '/' + theme + '.css', function(state) {
            if (state < 0 && theme_confirmed)
                localStorage.setItem('primary-theme-confirmed', '');
            else if (state > 0 && !theme_confirmed)
                localStorage.setItem('primary-theme-confirmed', true);
        });
        $DOC.appendScript('theme.js', $DOC.root + 'mods/' + theme + '/' + theme + '.js');
    }
    
    
    
    // load queued components
    if (window.clq12604) {
        var q = window.clq12604;
        for(var i = 0, c = q.length; i < c; i++)
            q[i]();
    }
    
}).call(this);
}
