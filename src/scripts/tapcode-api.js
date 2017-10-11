(function (Kano) {

    Kano.Tapcode = Kano.Tapcode || {};
    Kano.Tapcode.loop,
    Kano.Tapcode.api = [
        {
            name: 'moveBy',
            type: 'drawing',
            template: 'methodCall',
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
            body: `cursorX += x * 2;\ncursorY += y * 2;\n`
        },
        {
            name: 'moveTo',
            type: 'drawing',
            template: 'methodCall',
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
            body: `cursorX = x * 2;\ncursorY = y * 2;`
        },
        {
            name: 'moveToRandom',
            type: 'drawing',
            template: 'methodCall',
            body: `cursorX = Math.random() * canvas.width;\ncursorY = Math.random() * canvas.height;`
        },
        {
            name: 'lineTo',
            type: 'drawing',
            template: 'methodCall',
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
            body: `ctx.beginPath();\nctx.moveTo(startX * 2, startY * 2);\nctx.lineTo(endX * 2, endY * 2);\n
                    ctx.stroke();`
        },
        {
            name: 'circle',
            type: 'drawing',
            template: 'methodCall',
            parameters: [
                {
                    name: 'radius',
                    value: '50',
                    dataType: 'number'
                }
            ],
            body: `ctx.beginPath();\nctx.arc(cursorX * 2, cursorY * 2, radius * 2, 0, 2 * Math.PI, false);\n
                    ctx.fill();\nctx.stroke();\nctx.closePath();`
        },
        {
            name: 'square',
            type: 'drawing',
            template: 'methodCall',
            parameters: [
                {
                    name: 'size',
                    value: '100',
                    dataType: 'number'
                }
            ],
            body: ` var startX = cursorX * 2 - size;\n var startY = cursorY * 2 - size;
                    ctx.fillRect(startX, startY, size * 2, size * 2);\n
                    ctx.strokeRect(startX, startY, size * 2, size * 2);\nctx.closePath();`
        },
        {
            name: 'background',
            type: 'style',
            template: 'methodCall',
            parameters: [
                {
                    name: 'color',
                    value: '"#ffffff"',
                    dataType: 'color'
                }
         ],
         body: `var tmpColor = ctx.fillStyle;\nctx.fillStyle = color;\n
                ctx.fillRect(0, 0, canvas.width, canvas.height);\nctx.fillStyle = tmpColor;`
        },
        {
            name: 'fillColor',
            type: 'style',
            template: 'methodCall',
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
            template: 'methodCall',
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
            type: 'style',
            template: 'methodCall',
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
            template: 'methodCall',
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
            body: `return Math.random() * (to - from) + from;`
        },
        {
            name: 'randomColor',
            returns: 'color',
            template: 'methodCall',
            body: `return colorPalette[Math.floor(Math.random() * colorPalette.length)];`
        },
        {
            name: 'animate',
            type: 'control',
            template: 'control',
            body: ``
        },
        {
            name: 'repeat',
            type: 'control',
            template: 'repeat',
            parameters: [
                {
                    name: 'repetitions',
                    value: '10',
                    dataType: 'number'
                },
                {
                    name: 'loopSubject',
                    dataType: 'callback'
                }
            ],
            body: `for(var i = 0; i < repetitions; i++) {\nloopSubject();}`
        },
        
    ]
})(window.Kano = window.Kano || {});