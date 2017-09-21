(function (Kano) {

    Kano.TapCode = Kano.TapCode || {};
    Kano.TapCode.loop,
    Kano.TapCode.api = [
        {
            name: 'moveBy',
            type: 'drawing',
            parameters: [
                {
                    name: 'x',
                    value: '10',
                    dataType: 'number'
                },
                {
                    name: 'y',
                    value: '10',
                    dataType: 'number'
                }
            ],
            body: `cursorX += x;\ncursorY += y;\n`
        },
        {
            name: 'moveTo',
            type: 'drawing',
            parameters: [
                {
                    name: 'x',
                    value: '10',
                    dataType: 'number'
                },
                {
                    name: 'y',
                    value: '10',
                    dataType: 'number'
                }
            ],
            body: `cursorX = x;\ncursorY = y;`
        },
        {
            name: 'moveToRandom',
            type: 'drawing',
            body: `cursorX = Math.random() * canvas.width;\ncursorY = Math.random() * canvas.height;`
        },
        {
            name: 'lineTo',
            type: 'drawing',
            parameters: [
                {
                    name: 'startX',
                    value: '10',
                    dataType: 'number'
                },
                {
                    name: 'startY',
                    value: '10',
                    dataType: 'number'
                },
                {
                    name: 'endX',
                    value: '110',
                    dataType: 'number'
                },
                {
                    name: 'endY',
                    value: '10',
                    dataType: 'number'
                }
            ],
            body: ``
        },
        {
            name: 'circle',
            type: 'drawing',
            parameters: [
                {
                    name: 'radius',
                    value: '10',
                    dataType: 'number'
                }
            ],
            body: `ctx.beginPath();\nctx.arc(cursorX, cursorY, radius, 0, 2 * Math.PI, false);\nctx.fill();\nctx.stroke();`
        },
        {
            name: 'square',
            type: 'drawing',
            parameters: [
                {
                    name: 'size',
                    value: '20',
                    dataType: 'number'
                }
            ],
            body: ``
        },
        {
         name: 'background',
         type: 'style',
         parameters: [
             {
                 name: 'color',
                 value: '#2b3035',
                 dataType: 'color'
             }
         ],
         body: ``
        },
        {
         name: 'fillColor',
         type: 'style',
         parameters: [
             {
                 name: 'color',
                 value: '#ffff00',
                 dataType: 'color'
             }
         ],
         body: `ctx.fillStyle = color;`
        },
        {
            name: 'opacity',
            type: 'drawing',
            parameters: [
                {
                    name: 'value',
                    value: '10',
                    dataType: 'number'
                }
            ],
            body: `ctx.globalAlpha = value;`
        },
        {
         name: 'stroke',
         type: 'drawing',
         parameters: [
             {
                 name: 'thickness',
                 value: '1',
                 dataType: 'number'
             },
             {
                 name: 'color',
                 value: '#ff00ff',
                 dataType: 'color'
             }
         ],
         body: `ctx.strokeStyle = color;\nctx.lineWidth = thickness;`
        },
        {
         name: 'random',
         returns: 'number',
         parameters: [
             {
                 name: 'from',
                 value: '0',
                 dataType: 'number'
             },
             {
                 name: 'to',
                 value: '100',
                 dataType: 'number'
             }
         ],
         body: ``
        },
        {
         name: 'animate',
         type: 'control',
         body: ``
        }
    ]
})(window.Kano = window.Kano || {});