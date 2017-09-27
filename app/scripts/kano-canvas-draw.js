(function (Kano) {

    Kano.CanvasDraw = class {
    	constructor (opts) {
    		window.canvas = opts.canvas;
    		window.ctx = opts.ctx;
    		window.colorPalette = [
                '#ffffff',  // White
                '#000000',  // Black
                '#e95c5a',  // Red
                '#ff842a',  // Kano Orange
                '#f8eb1e',  // Yellow
                '#3caa36',  // Green
                '#0e6633',  // Dark Green
                '#59b3d0',  // Light Blue
                '#2a3080',  // Dark Blue
                '#642682',  // Violet
                '#db7d92',  // Pink
                '#683d12'   // Brown
            ];
        }

    	runCode (code) {
                if (Kano.TapCode.loop) {
                    window.cancelAnimationFrame(Kano.TapCode.loop);
                    Kano.TapCode.loop = null;
                }
            
                try {
                    // code = 'ctx.beginPath()\n' + code
                    window.userCode = new Function(code);
                    console.log(window.userCode);
                    window.userCode();
                } catch (err) {
                   console.log('err', err);
                }
    	}
    }

    resetCanvas = function (size) {
        console.log('size')
        // if (size) {
            
        // } else {
        //     cursorX = 0;
        //     cursorY = 0;
        // }
        cursorX = size / 2;
        cursorY = size /2;
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = "#2b3035";
        // ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#ff00ff";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
    }

})(window.Kano = window.Kano || {});
