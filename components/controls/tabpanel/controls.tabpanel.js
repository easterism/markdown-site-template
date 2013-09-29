//     controls.tabpanel.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// require controls.js

(function() { "use strict"; // #604 >>
var controls;
if (typeof module !== 'undefined' && typeof require !== 'undefined' && module.exports) {
    controls = require('controls');
    module.exports = CTabPanel;
} else if (typeof define === 'function' && define.amd)
    define(['controls'], function(c) { controls = c; return CTabPanel; });
else
    controls = this.controls;
if (!controls) throw new TypeError('controls.js not found!');
// << #604



    function CTabPanel(parameters, attributes) {
        
        controls.controlInitialize(this, 'tabpanel', parameters, attributes);
        this.class('tabpanel');
        
        // subcontrols
        var header = this.add('header:bootstrap.TabPanelHeader');
        var body = this.add('content:bootstrap.TabPanelBody', {class:'panel-body'});
        
        
        // place tabs on this.content panel
        $DOC.processContent(body, this.attributes.$text);
        this.attributes.$text = '';
        
        var found_active = false;
        for(var i = 0, c = body.length; i < c; i++)
        {
            var tabpage = body.controls[i];
            if (tabpage.__type === 'bootstrap.TabPage')
            {
                var tabheader = this.header.add('bootstrap.TabHeader', {$href:'#'+tabpage.id, $text:tabpage.Caption});
                if (tabpage.parameters.active)
                {
                    found_active = true;
                    tabheader.class('active');
                    tabpage.class('active in');
                }
            }
        }
        
        if (!found_active && header.length)
        {
            header.first.class('active');
            body.first.class('active in');
        }
    };
    CTabPanel.prototype = controls.control_prototype;
    controls.typeRegister('tabpanel', CTabPanel);
    
    
    function tabpage_factory(parameters, attributes) {
        
        // create and customize bootstrap.TabPage
        
        // create control
        var bootstrap_tabpage = controls.create('bootstrap.TabPage', parameters, attributes);
        
        // first #parameter name - tab caption
        bootstrap_tabpage.Caption = Object.keys(parameters)[0];
        
        // Here: this control is wrapped with HTML and markup not be processed.
        // To process the markup at this level:
        
        var this_text = bootstrap_tabpage.attributes.$text;
        bootstrap_tabpage.attributes.$text = '';
        $DOC.processContent(bootstrap_tabpage, this_text);
        
        // process markup template:
        bootstrap_tabpage.template($ENV.default_template, $ENV.default_inner_template);

        return bootstrap_tabpage;
    }
    controls.factoryRegister('tabpage', tabpage_factory);
    

}).call(this);
