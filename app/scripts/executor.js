document.addEventListener('run-code', () => {
	console.log('got the event');
	try {
		var code = new Function('moveBy()');
		code();
	} catch (err) {
		console.log('err', err);
	}
});