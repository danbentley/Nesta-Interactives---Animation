$(document).ready(function() {

	var POLLING_INTERVAL = 1;
	var intervalId;
	var playbackIntervalId;
	var positions = [];
	var frameCount = 0;
	var playbackFrameCount = 0;
	var recording = false;
	var characters = $('span[id^=figure-]');
	var $status = $('div.status');
	var $recordButton = $('a.record');
	var $playButton = $('a.play');
	var $stopButton = $('a.stop');
	var $resetButton = $('a.reset');

	characters.draggable({ 
		axis:"y",
		containment:[300, 1, 0, 300]
	});

	function storeOriginalPositions() {
		characters.each(function(index, character) {
			positions[index] = [];
		});	
	}

	function record() {

		if (recording) {
			return stopRecording();
		}

		stop();
		storeOriginalPositions();
		startRecording();
	}

	function stopRecording() {
		window.clearInterval(intervalId);
		updateStatus('');
		recording = false;
		$recordButton.html('<span>Record</span>');
	}

	function startRecording() {
		intervalId = window.setInterval(function() {
			characters.each(function(index, character) {
				positions[index][frameCount] = $(character).offset();
			});	
			frameCount++;
		}, POLLING_INTERVAL);
		recording = true;
		$recordButton.html('<span>Stop recording</span>');
		updateStatus('<span class="recording">Recording</span>');
	}

	function stop() {
		characters.draggable('enable');
		stopRecording();
		window.clearInterval(playbackIntervalId);
		updateStatus();
	}

	function play() {
		characters.draggable('disable');
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
		$status.html(status);
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
		e.preventDefault();
	});
});
