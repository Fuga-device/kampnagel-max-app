inlets = 1;
outlets = 1;

// default filter size if no argument provided
var filterSize = 3;
var halfFilterSize;
var buffer;
var bufferIndex;
var weights;
var normFactor;

function loadbang() {
	if (jsarguments.length > 1) {
		filterSize = jsarguments[1];
	}
	
	filtersize(filterSize);
}

function filtersize(s) {
	if (filterSize < 3) {
		filterSize = 3;
	} else if (filterSize % 2 == 0) {
		filterSize -= 1;
	}
	
	halfFilterSize = Math.floor(filterSize * 0.5);
	
	bufferIndex = 0;
	
	buffer = new Array(filterSize);
	for (var i = 0; i < filterSize; i++) {
		buffer[i] = 0;
	}
	
	weights = new Array(filterSize);
	for (var i = 0, w = -halfFilterSize; i < filterSize; i++, w++) {
		weights[i] = w;
	}
	
	normFactor = 0;
	for (var i = 1; i <= halfFilterSize; i++) {
		normFactor += i * i;
	}
	normFactor = 0.5 / normFactor;
	
	// DEBUG :
	// post('delta filter size : ' + filterSize + '\n');
}

function msg_float(f) {
	buffer[bufferIndex] = f;
	bufferIndex = (bufferIndex + 1) % filterSize;
	
	var delta = 0;
	for (var i = 0; i < filterSize; i++) {
		delta += buffer[(bufferIndex + i) % filterSize] * weights[i];
	}
	
	outlet(0, delta * normFactor);
}