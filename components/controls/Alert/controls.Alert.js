////////////////////////////////////////////////////////////////////////////////
//     
//     controls.Alert.js by vb The control for displaying alerts
//     control created (c) 2013 vadim baklanov https://github.com/aplib/common.controls
//     license: MIT
//
// require controls.js

(function() { "use strict";
var controls;
if (typeof module !== 'undefined' && typeof require !== 'undefined' && module.exports) {
    controls = require('controls');
    module.exports = CAlert;
} else if (typeof define === 'function' && define.amd)
    define(['controls'], function(c) { controls = c; return CAlert; });
else
    controls = this.controls;
if (!controls) throw new TypeError('controls.js not found!');



    // built-in message box
    // 
    function CAlert(par, att) {
        
        controls.controlInitialize(this, 'Alert', par, att);

        var style = 'warning';
        if (par.info) style = 'info';
        if (par.warning) style = 'warning';
        if (par.danger) style = 'danger';
        this.class('alert alert-block alert-' + style + ' fade in');
    };
    CAlert.prototype = controls.control_prototype;
    controls.typeRegister('Alert', CAlert);


}).call(this);
