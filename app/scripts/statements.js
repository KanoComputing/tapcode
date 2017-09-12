(function() {

	window.statements = [
		{
			name: 'moveBy',
			type: 'drawing',
			parameters: [
				{
					name: 'x',
					value: '20',
					dataType: 'number'
				},
				{
					name: 'y',
					value: '0',
					dataType: 'number'
				}
			],
			body: ``
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
			body: ``
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
			body: ``
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
			body: ``
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
			body: ``
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
		},


	]

	class Statement {
        constructor (opts) {
            this.name = opts.name;
            this.type = opts.type;
            this.returns = opts.returns;
            this.lines = this.getLines(opts);
            //PUT THIS BACK WHEN BLOCK IS FUNCTIONING
            // window[opts.name] = new Function(opts.parameters.map(p => p.name), opts.body);
            // console.log('this.lines', this.lines)
        }

        getLines (opts) {
        	let lines = this.getRawLines(opts);
        	return lines.map(this.formatLine.bind(this));
        }

        formatLine (l, i) {
        	if (i === 0) {
	        	l.segments.unshift(
	        		{
	                    value: this.name,
	                    type: this.type,
	                    returns: this.returns,
	                    handler: true,
	                    editable: true
	                }
	        	);
        	}
        	l.segments = l.segments.map(this.formatSegment);
        	return l;
       	}

       	formatSegment (s) {
			if (/[(]|[)]|[{]|[}]|[)]/.test(s)) {
				s = {
					value: s,
					type: 'token'	
				}
			} else if (typeof s === 'string') {
				// console.log((s === 'insertPoint'))
				s = {
       		    	type: s,
       		    	editable: s === 'insertPoint'
       		    }
       		}
    		return s;
       	}

       	getIndentation () {
       		return {
       			type: 'indentation'
       		}
       	}

       	getInsertPoint () {
       		return {
       		    type: 'insert',
       		    editable: true
       		}
       	}

       	getWhiteSpace () {
       		return {
       		    type: 'whitespace',
       		}
       	}
    }

    class FunctionCall extends Statement {
    	constructor (opts) {
	    	super(opts);
	    	this.params = opts.parameters;
    	}

    	getRawLines (opts) {
    		return [
    			{
    				segments: [].concat([], '(', this.getParams(opts), ')')
    			}
    		];
    	}

    	getParamDefaultValue (name) {
    		let value;
    		this.params.forEach(p => {
    		    if (p.name === name) {
	    			value = p.value;
    		    }
    		});
			return value;
    	}

    	getParams (opts) {
    		let paramsWithCommas = [];
    		opts.parameters.forEach((p, i, arr) => {
		        paramsWithCommas.push({
		            value: p.name,
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
    }

    class Block extends Statement {
    	constructor (opts) {
	    	super(opts);
    	}

    	getRawLines (opts) {
    		return [
    			{
    				segments: ['(',')', 'whitespace', '{']
    			},
    			{
    				segments: ['indentation', 'insertPoint']
    			},
    			{
    				segments: [
    					{
	                    	value: '}',
	                    	type: 'token',
	                    	endsBlock: true,
	                   	}
	                ]
    			}
    		];
    	}
    }


    window.TaptypeApi = class {
        	constructor (opts) {
        		this.statements = opts.map(f => {
        			if (f.type === 'control') {
        				return new Block(f);	
        			} else {
		        		return new FunctionCall(f);
        			}
        		});
        	}

        }
    
}());