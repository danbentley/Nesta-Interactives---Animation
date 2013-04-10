$(document).ready(function() {

	var POLLING_INTERVAL = 1;
	var intervalId;
	var playbackIntervalId;
	var positions = [];
	var frameCount = 0;
	var playbackFrameCount = 0;
	var characters = $('span[id^=figure-]');
	var statusEl = $('div.status');

	characters.draggable({ 
		axis:"y",
		containment:[300, 0, 0, 300]
	});

	function storeOriginalPositions() {
		characters.each(function(index, character) {
			positions[index] = [];
		});	
	}

	function record() {
		storeOriginalPositions();
		intervalId = window.setInterval(function() {
			characters.each(function(index, character) {
				positions[index][frameCount] = $(character).offset();
			});	
			frameCount++;
		}, POLLING_INTERVAL);
	}

	function stop() {
		window.clearInterval(intervalId);
		window.clearInterval(playbackIntervalId);
	}

	function play() {
		if (positions.length === 0) {
			alert('Press record before play');
			return;
		}
		playbackIntervalId = window.setInterval(function() {
			characters.each(function(index, character) {
				var position = positions[index][playbackFrameCount];
				$(character).offset(position);  
			});	
			playbackFrameCount++;
		}, POLLING_INTERVAL);
		updateStatus('<span class="playing">Playing</span>');
	}

	function reset() {
		stop();
		positions = [];
		playbackFrameCount = 0;
		frameCount = 0;
		characters.offset({ top: 44 });
	}

	function updateStatus(status) {
		statusEl.html(status);
	}

	$('a.reset').on('click', function(e) {
		reset();
		updateStatus('');
		e.preventDefault();
	});

	$('a.stop').on('click', function(e) {
		stop();
		updateStatus('<span class="stopped">Stopped</span>');
		e.preventDefault();
	});

	$('a.play').on('click', function(e) {
		stop();
		play();
		e.preventDefault();
	});

	$('a.record').on('click', function(e) {
		record();
		updateStatus('<span class="recording">Recording</span>');
		e.preventDefault();
	});
});
