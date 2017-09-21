(function (Kano) {

    Kano.CanvasDraw = class {
    	constructor (opts) {
    		window.canvas = opts.canvas;
    		window.ctx = opts.ctx;
    		window.cursorX = 0;
    		window.cursorY = 0;
        }

    	runCode (code) {
            resetCanvas();
    	    try {
                window.userCode = new Function(code);
                // console.log(window.userCode);
    	    	window.userCode();
    	    } catch (err) {
    	      console.log('err', err);
    	    }
    	}

        getCanvasState (code) {
            this.runCode(code);
            let state = {};
            state.cursorX = cursorX;
            state.cursorY = cursorY;
            state.imageData = ctx.getImageData(0, 0, 300, 300);
            return state;
        }
    }

    window.resetCanvas = function () {
        cursorX = 0;
        cursorY = 0;
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#2b3035";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "#ff00ff";
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
    }




})(window.Kano = window.Kano || {});
