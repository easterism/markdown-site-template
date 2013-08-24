////////////////////////////////////////////////////////////////////////////////
//
//     markdown-site-template 0.1
//     http://aplib.github.io/markdown-site-template/
//     (c) 2013 vadim baklanov
//     License: MIT
//
// require marked.js, controls.js, doT.js, jquery.js


window.addEventListener('load', function()
{
    // content and page structure
    var body = controls.create('body'), numbers = {};
    $(document.body).contents().each(function() {
        if (this.nodeType === 8 && this.nodeValue) {
            var val = this.nodeValue, match = val.match(/^\S*/);
            if (match) {
                var name = match[0], text = ((name) ? val.substr(name.length+1) : val).trim(), frame = name || 'fill';
                if (text) {
                    var number = frame.match(/[0-9]+$/); // frame name ends with number
                    if (number) {
                        number = number[0];
                        frame = frame.substr(0, frame.length - number.length);
                    }
                    else
                        number = numbers[frame] = (numbers[frame] || -1) +1;
                    frame = frame + (number ? number : '');
                    body.add(frame+':div', {class:frame, $text:marked(text)});
                }
            }
        }
    });

    body.attach();
    body.refresh();
    
    // patches
    
    var ftn = body['fixed-top-navbar'];
    if (ftn)
    {
        var $ftn = $(ftn.element), $body = $(document.body);
        $body.css("padding-top", (parseInt($body.css("padding-top")) + $ftn.height()) + 'px');
    }
});
