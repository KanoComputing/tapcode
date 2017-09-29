(function (Kano) {

   	Kano.Prism = class {
    	constructor (opts) {

    		this.templates = {
    			'*': 'handler',
    			'_': 'whitespace',
    			'x': 'indentation',
    			'o': 'insertPoint',
    			'p': 'parameters',
    			'f': 'function',
                'c': 'callback'
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
    		if (method.template !== 'control') {

    			window[method.name] = new Function(params, method.body);
    		}
    		return code;
    	}

    	getLines (method) {
    		let lines = [],
                lineProto,
                lineCounter = 1,
                startIndex = 0;
    		switch (method.template) {
    			case 'control':
                    // lineProto = ['f_*_()_{', 'xo', '}'];
    			    lineProto = 'f_*_()_{nxon}';
    			    break;
                case 'repeat':
                    // lines =['*(p,_f()_{','xo','}']
                    lineProto = '*(p,_c_()_{nxon})';
                    break;
	    		default:
	    			lineProto = '*(p)';
   		    }
            
            lineProto = lineProto.split('');
            
            lineProto = lineProto.map(segment => {
                
                segment = this.formatSegment(method, segment);
                return segment;
                
            });
            
            // if anything undefined (like no parameters), filter them out
            lineProto = lineProto.filter(l => typeof l !== 'undefined');
            
            lineProto = lineProto.reduce((sum, value) => {
                return sum.concat(value);
            }, []);
            
            
            var checkArr = lineProto;
            
            checkArr.forEach((item, index, array) => {
                if (item === 'n') {
                    lines.push(array.slice(startIndex, index))
                    startIndex = index + 1;
                }
                
                if (index === array.length - 1) {
                    lines.push(array.slice(startIndex))
                }
            });
            
            
            
            lines = lines.map(l => {
                return {segments: l}
            });
            
            
            return lines;
    	}

    	getParams (method) {
    		if (!method.parameters) {
    			return;
    		}
    		let paramsWithCommas = [],
                clonedParams;
            clonedParams = JSON.parse(JSON.stringify(method.parameters));
            clonedParams = clonedParams.filter(p => p.dataType !== 'callback');
    		clonedParams.forEach((p, i, arr) => {
                let formattedParam = {
                    value: p.name,
                    defaultValue: p.value,
                    paramIndex: i,
                    type: 'parameter',
                    dataType: p.dataType,
                    editable: true
                }
                paramsWithCommas = [].concat.apply([], [paramsWithCommas, formattedParam]);
                

		        if (i < arr.length - 1) {
		        	paramsWithCommas.push(
		        		{
                            value: ',',
                            type: 'comma'
                        }
                    );
		        }
    		});
            if (method.name === 'repeat') {
                // console.log("VOILA PARAMSWITHCOMMAS", paramsWithCommas)
            }
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
			} else if ((/[,]/.test(s))) {
                s = {
                    value: ',',
                    type: 'comma'
                }
            } else if ((/[n]/.test(s))) {
                s = 'n'
            } else {
                segmentType = this.templates[s];
                // console.log('format', segmentType)
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
                    case 'callback':
                        s = {
                            value: 'function\u0020',
                            type: 'callback'
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
