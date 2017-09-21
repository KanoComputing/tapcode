(function (Kano) {

   	Kano.Prism = class {
    	constructor (opts) {

    		this.templates = {
    			'*': 'handler',
    			'_': 'whitespace',
    			'x': 'indentation',
    			'o': 'insertPoint',
    			'p': 'parameters',
    			'f': 'function'
    		}
    		this.instances = {};
    		this.statements = opts.statements.map(method => {
    				return this.formatMethod(method);
    		});
    	}

    	formatMethod (method) {
    		let code = method,
    		params;
    		if (method.parameters) {
    			params = method.parameters.map(p => p.name);
    		}

    		this.instances[method] = method;
    		code.lines = this.getLines(method)
    		//creating functions
    		if (method.type !== 'control') {

    			window[method.name] = new Function(params, method.body);
    		}
    		return code;
    	}

    	getLines (method) {
    		let lines;
    		switch (method.type) {
    			case 'control':
    			    lines = ['f_*_()_{', 'xo', '}'];
    			    break;
	    		default:
	    			lines = ['*(p)'];
   		    }

	        return lines.map(l => {
	        	let segments = l.split('');
	        	segments = segments.map(this.formatSegment.bind(this, method));
	        	segments = segments.reduce((sum, value) => {
	        	    return sum.concat(value);
	        	}, []);
	        	segments = segments.filter(i => !!i);
	        	return {segments: segments}
	        });
    	}
    	

    	getParams (method) {
    		if (!method.parameters) {
    			return;
    		}
    		let paramsWithCommas = [];
    		method.parameters.forEach((p, i, arr) => {
		        paramsWithCommas.push({
		            value: p.name,
		            defaultValue: p.value,
                    paramIndex: i,
		            type: 'parameter',
		            dataType: p.dataType,
		            editable: true
		        });

		        if (i < arr.length - 1) {
		        	paramsWithCommas.push(
		        		{
                            value: ',',
                            type: 'comma'
                        }
                    );
		        }
    		});
    		return paramsWithCommas;
    	}

       	getHandler (method) {
       		return {
                value: method.name,
                type: method.type,
                returns: method.returns,
                handler: true,
                editable: true
	        };
       	}

    	formatSegment (method, s) {
    		let segmentType;
    		if (/[(]|[)]|[{]|[}]|[)]/.test(s)) {
				s = {
					value: s,
					type: 'token'	
				}

			} else {
				segmentType = this.templates[s];
	    		switch (segmentType) {
	    			case 'handler':
	    			    s = this.getHandler(method);
	    			    break;
		    		case 'parameters':
		    		    s = this.getParams(method);
		    		    break;
		    		case 'function':
		    			s = {
		    				value: 'function\u0020',
		    				type: 'function'
		    			}
		    			break;
		    		default:
		    			s = {
		    				value: s.value,
	       		    		type: segmentType,
	       		    		editable: segmentType === 'insertPoint'
	       		    	}
       		    }
	    	}
	    	return s;
	    }
    }

})(window.Kano = window.Kano || {});
