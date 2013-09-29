////////////////////////////////////////////////////////////////////////////////
//     
//     controls.css.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
//
// require controls.js

(function() { "use strict"; // #604 >>
var controls;
if (typeof module !== 'undefined' && typeof require !== 'undefined' && module.exports) {
    controls = require('controls');
    module.exports = true;
} else if (typeof define === 'function' && define.amd)
    define(['controls'], function(c) { controls = c; return true; });
else
    controls = this.controls;
if (!controls) throw new TypeError('controls.js not found!');
// << #604
    
    
    
    var transforms = ',matrix,translate,translateX,translateY,scale,scaleX,scaleY,rotate,skewX,skewY,matrix3d,translate3d,translateZ,scale3d,scaleZ,rotate3d,rotateX,rotateY,rotateZ,perspective,';
    
    // control + auto-css pair factory
    function  Felement(__type, parameters, attributes, css) {
        
        var control = controls.create(__type, parameters, attributes);
        
//        // generated css class name
//        control.cssClassName = 'auto-' + control.id;
        
        // >> parse style from parameters 
        
        parameters = control.parameters;
        var style = control.attributes.style || '';
        var transform = '';
        for(var name in parameters) {
            if (name === 'origin' || name === 'transform-origin')
                style += 'transform-origin:' + parameters.origin + ';-webkit-transform-origin:' + parameters.origin + ';-moz-transform-origin:' + parameters.origin + ';';
            else if (transforms.indexOf(name.trim()) >= 0) {
                if (transform)
                    transform += ' ';
                // translate=1,2 -> translate(1,2)
                transform += name +'(' + parameters[name] + ')';
            } else  {
                if (name[0] !== '$')
                    style += name + ':' + parameters[name] + ';';
            }
        }
        if (transform) {
            if (style && style.slice(-1) !== ';')
                style += ';';
            style += 'transform:' + transform + ';-webkit-transform:' + transform + ';-moz-transform:' + transform + ';';
        }
        if (style) {
//            style = '.' + control.cssClassName + '{' + style + '}';
//            control.attributes.style = undefined;
            control.attributes.style = style;
        }
        
        // << parse style from parameters
        
        
//        // >> css text normalization
//        
//        if (css) {
//            
//            if (style)
//                style += ' ';
//                
//            var classname = '.' + control.cssClassName;
//            
//            if (css.indexOf('{') < 0) {
//                css = '.' + control.cssClassName + '{' + css + '}';
//            } else if (css.indexOf(classname) < 0) {
//                css = classname + css.trim();
//            }
//            
//            style += css;
//        }
//        
//        // << css text normalization
//        
//        if (style) {
//            // build css element
//            // style = style.replace(/;/g, ' !important;');
//            
//            $DOC.appendCSS(control.cssClassName, style);
//        }
        
        return control;
    }
        
    function process_inner_text(control) {
        // process markup at this level
        var inner_text = control.attributes.$text;
        if (inner_text)
        {
            $DOC.processContent(control, inner_text);
            control.attributes.$text = undefined;
        }
    }


    // styled block div factory
    function Block(parameters, attributes) {
        var control = Felement('div', parameters, attributes);
        control.template($ENV.default_template, $ENV.default_inner_template);
        process_inner_text(control);
//        control.class(control.cssClassName);
        return control;
    };
    controls.factoryRegister('block', Block);
    
    
    function IBlock(parameters, attributes) {
        var control = Block(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('iblock', IBlock);

    function span_template(it) {
        return '<span' + it.printAttributes() + '>'
            + $ENV.markedPostProcess( (it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("") )
            + '</span>';
    }
    function Text(parameters, attributes) {
        var control = Felement('span', parameters, attributes);
        control.template(span_template, $ENV.default_inner_template);
        process_inner_text(control);
//        control.class(control.cssClassName);
        return control;
    };
    controls.factoryRegister('text', Text);
    
    
    function  Off(parameters, attributes) {
        var off_mode = $DOC.options.off;
        var off_text = controls.create('container', parameters, attributes);
        $DOC.options.off = off_mode;
        return off_text;
    }
    controls.factoryRegister('off', Off);
    
    
    function  Encode(parameters, attributes) {
        var control = controls.create('container', parameters, attributes);
        control.template(html_encode, html_encode);
        process_inner_text(control);
        return control;
    }
    function html_encode(it) {
        return controls.encodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join(""));
    }
    controls.factoryRegister('encode', Encode);
    
    
    function  Decode(parameters, attributes) {
        var control = controls.create('container', parameters, attributes);
        control.template(html_decode, html_decode);
        process_inner_text(control);
        return control;
    }
    function html_decode(it) {
        return controls.decodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join(""));
    }
    controls.factoryRegister('decode', Decode);
    
    
    function  Escape(parameters, attributes) {
        var control = controls.create('container', parameters, attributes);
        control.template(escape_template, escape_template);
        process_inner_text(control);
        return control;
    }
    function escape_template(it) {
        return '<span>' + controls.encodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("")) + '</span>';
    }
    controls.factoryRegister('escape', Escape);


}).call(this);
