//     controls.panels.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// require controls.js

(function() { "use strict"; // #604 >>
var controls;
if (typeof module !== 'undefined' && typeof require !== 'undefined' && module.exports) {
    controls = require('controls');
    module.exports = Collapse;
} else if (typeof define === 'function' && define.amd)
    define(['controls'], function(c) { controls = c; return Collapse; });
else
    controls = this.controls;
if (!controls) throw new TypeError('controls.js not found!');
// << #604

var bootstrap = controls.bootstrap;
    
    // Panel
    
    var known_params = 'style header footer default info link success primary warning danger';
    function Panel(parameters, attributes) {
        
        var panel = controls.create('bootstrap.Panel', parameters, attributes);
        
        // look for header in parameters
        for(var prop in parameters)
        if (known_params.indexOf(prop) < 0 || prop === 'header') {
            panel.header.text(prop);
            break;
        }
        
         if (parameters.footer)
            panel.footer.text(parameters.footer);
            
        var body = panel.body;
        $DOC.processContent(body, body.text());
        body.text('');
        
        // process markup template:
        body.template($ENV.default_template, $ENV.default_inner_template);
        
        return panel;
    };
    controls.factoryRegister('panel', Panel);
    
    
    function iPanel(parameters, attributes) {
        var control = Panel(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('ipanel', iPanel);
    
    
    // Collapse
    
    function Collapse(parameters, attributes) {
        
        controls.controlInitialize(this, 'collapse', parameters, attributes, $ENV.default_template, $ENV.default_inner_template);
        
        var in_panel = this.parameter('panel');
        var panel_class = (typeof in_panel === 'string') ? in_panel : undefined;
        var start_collapsed = parameters.collapse || parameters.collapsed;
        
        for(var prop in parameters)
        if (prop.substr(0,6) === 'panel-')
            panel_class = prop;
        
        this.class('collapse-panel' + (in_panel || panel_class ? ' panel ' + (panel_class || 'panel-default') : ''));
        
        // subcontrols
        var collapse = this.add('collapse:div', {class:'panel-collapse collapse collapse-body' + (start_collapsed ? '' : ' in')});
        var content = collapse.add('div', {class:'panel-body'});
        var header = this.insert(0, 'header:div',
        {
                    class: 'panel-heading collapse-header',
            'data-toggle': 'collapse',
            'data-target': '#'+collapse.id,
                    $text: '<a href="#" class="panel-title">' + Object.keys(parameters)[0] + '</a>'
        });
        
        $DOC.processContent(content, this.text());
        this.text('');
        
        // process markup template:
        content.template($ENV.default_template, $ENV.default_inner_template);
    };
    Collapse.prototype = bootstrap.control_prototype;
    controls.typeRegister('collapse', Collapse);
    
    
    function iCollapse(parameters, attributes) {
        var control = Collapse(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('icollapse', iCollapse);
    
    
    // Alert
    
    function Alert(parameters, attributes) {
        
        controls.controlInitialize(this, 'alert', parameters, attributes, $ENV.default_template, $ENV.default_inner_template);
        this.class('alert alert-' + this.getControlStyle() + ' fade in');
        
        // process markup at this level
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Alert.prototype = bootstrap.control_prototype;
    controls.typeRegister('alert', Alert);
    
    
    function iAlert(parameters, attributes) {
        var control = Alert(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('ialert', iAlert);
    
    
    // Well
    
    function Well(parameters, attributes) {
        
        controls.controlInitialize(this, 'well', parameters, attributes, $ENV.default_template, $ENV.default_inner_template);
        this.class('well');
        
        var size = this.getControlSize();
        if (size === 'small')
            this.class('well-sm');
        else if (size === 'large')
            this.class('well-lg');
        
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Well.prototype = bootstrap.control_prototype;
    controls.typeRegister('well', Well);
    
    
    function iWell(parameters, attributes) {
        var control = Alert(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('iwell', iWell);
    
    
}).call(this);
