$(document).ready(function() {

	var POLLING_INTERVAL = 1;
	var intervalId;
	var playbackIntervalId;
	var positions = [];
	var frameCount = 0;
	var playbackFrameCount = 0;
	var characters = $('span[id^=figure-]');
	var statusEl = $('div.status');
	var $recordButton = $('a.record');
	var $playButton = $('a.play');
	var $stopButton = $('a.stop');
	var $resetButton = $('a.reset');

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
		updateStatus();
	}

	function play() {
		playbackFrameCount = 0;
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

	$resetButton.on('click', function(e) {
		if ($(this).hasClass('disabled')) return;
		$playButton.addClass('disabled');
		$resetButton.addClass('disabled');
		reset();
		updateStatus('');
		e.preventDefault();
	});

	$stopButton.on('stop').on('click', function(e) {
		if ($(this).hasClass('disabled')) return;
		stop();
		updateStatus('<span class="stopped">Stopped</span>');
		e.preventDefault();
	});

	$playButton.on('click', function(e) {
		if ($(this).hasClass('disabled')) return;
		stop();
		play();
		e.preventDefault();
	});

	$recordButton.on('click', function(e) {
		if ($(this).hasClass('disabled')) return;
		$playButton.removeClass('disabled');
		$resetButton.removeClass('disabled');
		record();
		updateStatus('<span class="recording">Recording</span>');
		e.preventDefault();
	});
});
