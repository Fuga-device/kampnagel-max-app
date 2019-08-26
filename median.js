inlets = 1;
outlets = 1;

// default filter size if no argument provided
var filterSize = 3;
var halfFilterSize;
var buffer;
var sortedBuffer;
var bufferIndex;

function loadbang() {
	if (jsarguments.length > 1) {
		filterSize = jsarguments[1];
	}
	
	filtersize(filterSize);
}

function filtersize(s) {
	if (s < 3) {
		filterSize = 3;
	} else if (s % 2 == 0) {
		filterSize = s - 1;
	} else {
		filterSize = s;
	}
	
	halfFilterSize = Math.floor(filterSize * 0.5);
	
	buffer = new Array(filterSize);
	sortedBuffer = new Array(filterSize);
	
	for (var i = 0; i < filterSize; i++) {
		buffer[i] = 0;
		sortedBuffer[i] = 0;
	}
	
	bufferIndex = 0;	

	// DEBUG :
	// post('median filter size : ' + filterSize + '\n');
}

function msg_float(f) {
	for (var i = 0; i < filterSize; i++) {
		sortedBuffer[i] = buffer[i];
	}
	
	for (var i = 0; i < halfFilterSize + 1; i++) {
		var minVal = 1e+6;
		var minIndex = -1;
		
		for (var j = i; j < filterSize - i; j++) {
			if (sortedBuffer[j] < minVal) {
				minVal = sortedBuffer[j];
				minIndex = j;
			}
		}
		
		var tmp = sortedBuffer[i];
		sortedBuffer[i] = minVal;
		sortedBuffer[minIndex] = tmp;
	}
	
	buffer[bufferIndex] = f;
	bufferIndex = (bufferIndex + 1) % filterSize;
	
	outlet(0, sortedBuffer[halfFilterSize]);
}