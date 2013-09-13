////////////////////////////////////////////////////////////////////////////////
//     
//     controls.math.js
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
    
    
    var load_controls = [],
        script_template = controls['controls.script'].outer_template,
        preload_template = controls.doT.template('<div{{=it.printAttributes()}}>loading...</div>');
    
    // after MathJax.js loaded
    function onload() {
        var math_type = this.parameters.type || Object.keys(this.parameters)[0] || 'mml';
        this.attr('type', 'math/' + math_type + '; mode=display');

        // in MathML <!-- − --> write as [!-- − --] (replace brackets) only if notation placed in <!--section -->
        if (math_type === 'mml' && this.attributes.$text)
            this.attributes.$text = this.attributes.$text.replace(/--\]/g, '-->').replace(/\[!--/g, '<!--');

        this.template(script_template);
        this.refresh();
    }
    
    // if MathJax.js load error
    function onerror() {
        this.template(function(){ return '&lt;' + this.__type + '?&gt;';});
        this.refresh();
    }

    function CMathJax(parameters, attributes) {
        controls.controlInitialize(this, 'math.MathJax', parameters, attributes);
        
        if (typeof MathJax === 'undefined') {
            // MathJax yet not loaded
            this.template(preload_template);
            load_controls.push(this);
        } else {
            // MathJax loaded
            onload.call(this);
        }
    }
    CMathJax.prototype = controls.control_prototype;
    controls.typeRegister('math.MathJax', CMathJax);  // utype
    controls.typeRegister('controls.math', CMathJax); // cocurrent type
    

    // load from CDN:
    if (typeof MathJax === 'undefined') {
        var config = 'TeX-AMS-MML_HTMLorMML'; // http://docs.mathjax.org/en/latest/configuration.html
        $$DOC.appendScript('math.MathJax', "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=" + config, function(state) {
            for(var prop in load_controls) {
                var control = load_controls[prop];
                if (state > 0)
                    onload.call(control);
                else
                    onerror.call(control);
            }
            load_controls = [];
        });
    }

}).call(this);
