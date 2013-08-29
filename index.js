////////////////////////////////////////////////////////////////////////////////
//
//     markdown-site-template 0.1
//     http://aplib.github.io/markdown-site-template/
//     (c) 2013 vadim baklanov
//     License: MIT
//
// require marked.js, controls.js, doT.js, jquery.js

// marked.js support GitHub Flavored Markdown see on https://github.com/chjj/marked/wiki
// For enable GitHub Flavored Markdown uncommented next options code lines:
//// Set default options except highlight which has no default
//marked.setOptions({
//  gfm: true,
////  highlight: function (code, lang, callback) {
////    pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
////      if (err) return callback(err);
////      callback(null, result.toString());
////    });
////  },
//  tables: true,  breaks: false,  pedantic: false,  sanitize: true,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
//});

var $exportText_data__ = {};
function $exportText(name, content_func)
{
    var content = content_func.toString().trim();
    var asterpos = content.indexOf('*');
    $exportText_data__[name] = content.substr(asterpos + 1, content.length - asterpos - 4);
}

(function()
{
    function $escape(par, att)
    {
        controls.controlInitialize(this, 'escape', par, att);
    };
    $escape.prototype = controls.control_prototype;
    controls.typeRegister('escape', $escape);
    
    
    function $import(parameters, attributes)
    {
        controls.controlInitialize(this, 'import', parameters, attributes, $import.outer_template);
        
        this.getContent = function()
        {
            var content_id = this.attributes.$text;
            if (content_id)
            {
                content_id = content_id.trim();
                var content_text = $exportText_data__[content_id];
                if (content_text)
                    return marked(content_text);
                else
                    return '&#60;' + content_id + '?&#62;';
                    
            }
            
            return '&#60; ?&#62;';
        };
    };
    $import.prototype = controls.control_prototype;
    $import.outer_template = doT.template('<span{{=it.printAttributes()}}>{{=it.getContent()}}</span>');
    controls.typeRegister('import', $import);
    
    // built-in message box
    // 
    function msgbox(par, att)
    {
        controls.controlInitialize(this, 'msgbox', par, att);

        var style = 'warning';
        if (par.info) style = 'info';
        if (par.warning) style = 'warning';
        if (par.danger) style = 'danger';
        this.class('alert alert-block alert-' + style + ' fade in');
        this.style('display:inline-block;float:none;');
    };
    msgbox.prototype = controls.control_prototype;
    controls.typeRegister('msgbox', msgbox);

    
    // built-in static css effects
    
    var transforms = ',matrix,translate,translateX,translateY,scale,scaleX,scaleY,rotate,skewX,skewY,matrix3d,translate3d,translateZ,scale3d,scaleZ,rotate3d,rotateX,rotateY,rotateZ,perspective,';
    function parse_effects(_this, par, att)
    {
        var over = {};

        var transform = '';
        for(var prop in par)
        if (transforms.indexOf(prop) < 0)
            over[prop] = par[prop];
        else {
            var fname = prop, fpars = par[fname];
            if (fpars && transform)
                transform += ' ';
            if (fpars)
                transform += fname +'(' + fpars + ')';
            if (transform) {
                over.transform = transform;
            }
        }
        if (par.origin)
            over['transform-origin'] = par.origin;
        
        _this.over = over;
    }
        
    function static(par, att)
    {
        att.$text = marked(att.$text);

        controls.controlInitialize(this, 'static', par, att);
        this.style('display:inline-block;');

        parse_effects(this, par, att);
        
        this.listen('element', function() {
            var element = this.element;
            if (element) {
                var $q = $(this.element);
                for(var prop in this.over)
                    $q.css(prop, this.over[prop]);
            }
        });
    };
    static.prototype = controls.control_prototype;
    controls.typeRegister('static', static);
    
    
    // hover - built-in mouse over effects
    
    function hover_mouseenter(_this) {
        var element = _this.element;
        var $q = $(element);
        var restore = _this.restore;
        var over = _this.over;
        for(var prop in over) {
            if (!restore[prop])
                restore[prop] = $q.css(prop);
            $q.css(prop, over[prop]);
        }
    }
    function hover_mouseleave(_this) {
        var $q = $(_this.element);
        var restore = _this.restore;
        for(var prop in restore) {
            var restoreval = restore[prop];
            if (restoreval !== undefined) {
                $q.css(prop, restoreval);
                restore[prop] = undefined;
            }
        }
    }
    function hover(par, att)
    {
        att.$text = marked(att.$text);

        controls.controlInitialize(this, 'hover', par, att);
        this.style('display:inline-block;');

        parse_effects(this, par, att);
        this.restore = {};
        this.listen('element', function()
        {
            var element = this._element;
            if (element)
            {
                var _this = this;
                var $q = $(element);
                $q.mouseenter(function() {
                    hover_mouseenter(_this);
                });
                $q.mouseleave(function() {
                    hover_mouseleave(_this);
                });
            }
        });
    };
    hover.prototype = controls.control_prototype;
    controls.typeRegister('hover', hover);
})();


(function()
{
    // These elements are are not attached, childs are attached
    var head = controls.create('head'), body = controls.create('body');
    
    // process text element
    function processElement(collection, collnode, element) {
        var val = element.nodeValue, match = val.match(/^\S*/);
        if (match) {
            var frame = match[0], text = ((frame) ? val.substr(frame.length+1) : val);
            // skip unnamed for compatibility
            if (frame && text) {
                // replace text element
                var text = text.split(/(\$\S{1,256}(?:#.*)?\([\s\S]*?\)\$\S{1,256})/gm);
                var cframe = collection.add(frame+':div', {class:frame});
                var buffered_text = '';
                for(var i = 0, c = text.length; i < c; i++) {
                    var frag = text[i];
                    if (!frag) continue;
                    if (frag[0] === '$') {
                        var parpos = frag.indexOf('('),
                            amptag = frag.substr(0, parpos),
                            cname = frag.substr(1, parpos - 1),
                            numberpos = amptag.indexOf('#'),
                            finalamptag = (numberpos >= 0) ? amptag.substr(0, numberpos) : amptag;

                        if (frag.slice(-finalamptag.length - 1) === ')' + finalamptag) {
                            var inner_text = frag.substr(amptag.length + 1, frag.length -2 -amptag.length -finalamptag.length);
                            // lookup control
                            try {
                                // pass inner text to control
                                var control = controls.create(cname, {$text: inner_text});
                                if (control) {
                                    if (buffered_text && (buffered_text.length > 16 || buffered_text.trim())) { // flush buffer
                                        cframe.add('container', {$text:marked(buffered_text)});
                                        buffered_text = '';
                                    }
                                    cframe.add(control);
                                }
                                continue;
                            } catch (e) {  }
                            // lookup markup parse function
                            var markup_func = this[amptag] || window[amptag]; 
                            if (markup_func) {
                                if (buffered_text && (buffered_text.length > 16 || buffered_text.trim())) { // flush buffer
                                    cframe.add('container', {$text:marked(buffered_text)});
                                    buffered_text = '';
                                }
                                cframe.add('container', {$text: markup_func(inner_text)});
                                continue;
                            }
                        }
                    }
                    buffered_text += frag;
                }
                if (buffered_text && (buffered_text.length > 16 || buffered_text.trim())) // flush buffer
                    cframe.add('container', {$text:marked(buffered_text)});

                cframe.createElement(element, 2);
                collnode.removeChild(element);
            }
        }
    }
    function processNode(collection, collnode) {
        
        if (!collnode)
            return;
        
        // iterate texts
        var nodes = collnode.childNodes, buffer = [];
        for(var i = 0, c = nodes.length; i < c; i++)
            buffer[i] = nodes[i];
        for(var i = 0, c = buffer.length; i < c; i++)
        {
            var element = buffer[i];
            if (element.nodeType === 8 && element.nodeValue)
                processElement(collection, collnode, element);
        }
    }
    
    processNode(head, document.head);
    var timer = setInterval(function()
    {
        processNode(body, document.body);
    }, 100);
    window.addEventListener('load', function()
    {
        processNode(head, document.head);
        processNode(body, document.body);
        clearInterval(timer);
        

        // patches
        
        $('table').addClass('table table-bordered table-stripped');

        var fixed_top_navbar = body['fixed-top-navbar'];
        var left_side_bar = body['left-side-bar'];
        var left_side_column = body['left-side-column'];
        var content = body.content;
        var right_side_bar = body['right-side-bar'];
        var right_side_column = body['right-side-column'];
        var footer = body.footer;
        var fixed_bottom_footer = body['fixed-bottom-footer'];

        if (fixed_top_navbar)
        {
            // apply bootstrap classes to navbar
            fixed_top_navbar.$.addClass('navbar navbar-default navbar-fixed-top');
            fixed_top_navbar.$.find('ul').addClass('nav navbar-nav');
            // activate current page
            var loc = window.location.href.toLowerCase();
            fixed_top_navbar.$.find('ul li a').each(function(i,a) {
                var href = a.href.toLowerCase();
                if (href === loc || loc.split(href).concat(href.split(loc)).some(function(frag){return frag && ('index.htm,index.html'.indexOf(frag) >= 0); }))
                    $(a.parentNode).addClass('active');
            });
            // body padding
            $(document.body).css('padding-top', (parseInt('0' + document.body.style['padding-top']) + fixed_top_navbar.element.clientHeight) + 'px');
        }

        // columns
//        if (content && (left_side_column || right_side_column))
//            content.class((left_side_column && right_side_column) ? 'col-sm-4' : 'col-sm-8');
//        if (left_side_column)
//            left_side_column.class('col-sm-4');
//        if (right_side_column)
//            right_side_column.class('col-sm-4');

        // sidebars
        if (content && (left_side_bar || right_side_bar))
             $(content.element).css('width', 100 - ((left_side_bar || left_side_column) ? 25 : 0) - ((right_side_bar || right_side_column) ? 25 : 0) + '%');

        // body padding on fixed-bottom-footer
        if (fixed_bottom_footer)
            $(document.body).css('padding-bottom', parseInt('0' + document.body.style['padding-bottom']) + 2 * fixed_bottom_footer.element.clientHeight + 'px');
     });
})();