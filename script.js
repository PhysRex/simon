
var handler = {
	listeners: function() {
		// Event listeners for buttons clicked
		// window.addEventListener( "click", this.btnPress );
		["click", "keydown", "touchend"].forEach( function(val) {
			window.addEventListener( val, this.btnPress );
		}, this);
	},
	btnPress: function() {
		// get element that was clicked on as an event		

		var elementClicked = event.target;
		function tagClass(text) {
			// return true if text is in classList
			var test = elementClicked.classList.contains(text);
			return test;
		} 
		var keyCode = event.keyCode;
		// set btnID as ID of the button clicked
		var id =  (elementClicked.id===undefined) ? 0 : elementClicked.id;	
		var className = (elementClicked.className===undefined) ? 0 : elementClicked.className ;
		var type = (elementClicked.type===undefined) ? 0 : elementClicked.type ;
		var checked = (elementClicked.checked===undefined) ? 0 : elementClicked.checked ;
		
		// console.log(...)
		// console.log(event);
		// console.log("element:",
		// 						"\n      id:", id, 
		// 						"\n   class:", className,
		// 						"\n    type:", type,
		// 						"\n checked:", checked);
		
		if (tagClass("start")){
				simon.start(checked);
		}
				
		if (tagClass("strict")){
				if (checked) {
					simon.strictMode = 1;
				} else {
					simon.strictMode = 0;
				}
		}
		
		if (tagClass("tile") && simon.simon === 1){
			// check if correct
			simon.check(event);			
		}
		
		elementClicked.blur();
		
	}
}

var simon = {
	simon: 1,
	strictMode: 0,
	turn: 0,
	index: 0,
	option: ["green", "red", "blue", "yellow"],
	order: [],
	start: function(checked) {
		var tile = document.querySelector(".game");
		
		if (checked) {
			
			// get list numbers to represent tiles
			this.order = this.random(20, 3);
			
			tile.classList.remove("pointer");			
			this.play();
		} else {
			tile.classList.add("pointer");
			this.end();
		}
	},
	play: function() {
		// iterate turn
		this.turn += 1;
		output.count();
		
		// "play" tiles for user		
		this.playback(0);
	},
	playback: function(i) {

		/* 
		// SIMULATES CLICK TO PRODUCE PLAYBACK
		//this.simon = 0;
		// Create the event.
		var event = document.createEvent('Event');

		// Define that the event name is 'click'.
		event.initEvent('click', true, true);

		// SIMULATES CLICK
		if (i >= this.turn) {
			this.simon = 1;
			return;
		} else {
			var text = this.option[this.order[i]];
			// activate tile
			var tile = document.getElementById(text);
			tile.classList.toggle("active");

			// play sound on a delay
			i++;
			output.sound(text);
			// output.waves(1000, (i+1)*200);
			setTimeout(function() {
				tile.dispatchEvent(event);
				tile.classList.toggle("active");
				// simon.playback(i);
			},1000);

			setTimeout(function() {
				simon.playback(i);
			},1000);
		}
		 */
		
		// PLAYBACK OF CLICKS
		if (i >= this.turn) {
			return;
		} else {
			var text = this.option[this.order[i]];
			// activate tile
			var tile = document.getElementById(text);
			tile.classList.toggle("active");
			
			// play sound on a delay
			i++;
			output.sound(text);
			setTimeout(function() {
				tile.classList.toggle("active");
			},500);
			
			setTimeout(function() {
				simon.playback(i);
			},1000);
		}
		
	},
	random: function(length, maxNum) {
		// return array of length *length*,
		//of random numbers from [0, maxNum]
		
		// maxNum -= 1;
		var arr = [];
		for (var i = 0; i<length; i++) {
			x = Math.round(Math.random()*maxNum);
			arr.push(x);
		}
		return arr;
	},
	strict: function() {
		if (this.strictMode === 1) {
			// add modal or text that game is over...			
			this.end();
		} else {
			setTimeout(function() {
				simon.playback(0);
			}, 1000);			
		}
	},
	check: function(event) {
		// live check against the generated random order
		
		var id = event.target.id;
		var option = this.option;
		var index = this.index;
		var order = this.order;
		var turn = this.turn;
		
		// check if current tile press is correct
		if (order[index] === option.indexOf(id)) {
			output.sound(id);
			this.index++;
		} else {
			output.sound("error");
			this.index = 0;
			this.strict();
		}

		// Win condition, for game (ends game)
		if (this.index===20) {			
			// ADD: display winner modal!...
			output.sound("success");
			this.end();
		} else if (this.index >= turn) {
			setTimeout( function() {				
				simon.index = 0;
				simon.play();
			},1000);			
		} else {}
	},
	end: function() {
		this.turn = 0;
		this.strictMode = 0;
		this.order = [];
		
		var start = document.querySelector(".start");
		var strict = document.querySelector(".strict");
		var count = document.querySelector(".count");
		var game = document.querySelector(".game");
		start.checked = false;
		strict.checked = false;
		count.textContent = "00";
		game.classList.add("pointer");			
		
		try {throw new Error("Game Over");}		
		catch (err) {}
	}
}

var output = {
	// ctx: new(AudioContext || webkitAudioContext),
	soundFiles: ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3", "https://www.freesound.org/data/previews/331/331912_3248244-lq.mp3", "http://soundbible.com/mp3/Beep-SoundBible.com-923660219.mp3", "http://soundbible.com/mp3/Ta Da-SoundBible.com-1884170640.mp3"],
	waves: function(milliseconds, frquency) {
		var play = this.osci();
		play(milliseconds, frquency);
	},
	osci: function() {
		//http://stackoverflow.com/questions/29356041/createoscillator-noteon-not-working?noredirect=1&lq=1
			
		var ctx = this.ctx;

		return function(duration, freq, finishedCallback) {
			duration = +duration;
			if (typeof finishedCallback != "function") {
				finishedCallback = function() {};
			}
			var osc = ctx.createOscillator();
			osc.type = 0;
			osc.connect(ctx.destination);
			osc.frequency.value = freq;

			if (osc.start) osc.start();
			else osc.noteOn(0);

			setTimeout(
				function() {
					if (osc.stop) osc.stop(0);
					else osc.noteOff(0);
					finishedCallback();
				}, 
				duration);
		};
	},
	sound: function(text) {
		// play individual sounds
		// console.log("   >>sound:",text);
		var index = (text==="success") ? 6 : (text==="error") ? 4: simon.option.indexOf(text);

		// output.waves(200, (index+1)*200);
		
		var snd = new Audio(this.soundFiles[index]); 
		snd.play();
		snd.currentTime = 0;
	},
	count: function() {
		// count of successful turns
		
		var count = document.querySelector(".count");
		count.textContent = this.padZero(simon.turn);
		
	},
	padZero: function(num) {
		num = parseInt(num);
    if (num < 10) {
			num = "0" + num;
    }
    return num;
	}
}

// run listeners
handler.listeners();

// play oscillator sounds
// output.waves(1000, 800);

/*
// ####################################################################################################
// ####################################################################################################
// ####################################################################################################
// http://codetheory.in/solve-your-game-audio-problems-on-ios-and-android-with-web-audio-api/

if (typeof webkitAudioContext !== 'undefined') {
  var audio_ctx = new webkitAudioContext();
}
   
function loadMusic(url, cb) {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  // XHR2
  req.responseType = 'arraybuffer';
 
  req.onload = function() {
    audio_ctx.decodeAudioData(req.response, cb);
  };
 
  req.send();
}


// loadMusic is just a utility function that loads the audio via XHR. Let’s look at how we invoke it.

GAME.audio = {};
 
var audio = {
  enemy: 'sfx/enemy.mp3',
  normal_jump: 'sfx/normal_jump.mp3',
  super_jump: 'sfx/super_jump.mp3',
  space_belt: 'sfx/space_belt.mp3',
  game_over: 'sfx/game_over.mp3'
}
 
var loadAudioData = function(name, url) {
 
  // Async
  loadMusic(url, function(buffer) {
    GAME.audio[name] = buffer;
  });
 
};
 
for (var name in audio) {
  var url = audio[name];
  loadAudioData(name, url);
}

// We just loaded all our audio data and stored them in an object available on a global variable called GAME that acts as a namespace. So how do we play the sound exactly ? Let’s write a few helper functions that can help us achieve this.

function playSound (buffer, opt, cb) {
  if (!opt) cb = opt;
  opt = opt || {};
 
  var src = audio_ctx.createBufferSource();
  src.buffer = buffer;
 
  gain_node = audio_ctx.createGainNode();
  src.connect(gain_node);
   
  gain_node.connect(audio_ctx.destination);
  //console.log(gain_node);
 
  if (typeof opt.sound !== 'undefined')
    gain_node.gain.value = opt.sound;
  else
    gain_node.gain.value = 1;
 
  // Options
  if (opt.loop)
    src.loop = true;
 
  src.noteOn(0);
 
  cb(src);
}
 
function stopSound (src) {
  src.noteOff(0);
}

// Do you notice the playSound method has a callback parameter cb which is called with the buffer source object ? I’ll show you why I did that in a bit (basically so that we can stop/pause the source later). So how do we go about calling playSound to play our sound at different actions in the game ?

function playGameSound(name, opt) {
  opt = opt || {};
 
  var cb = function(src) {
    GAME.audio_src[name] = src;
  };
 
  playSound( GAME.audio[name], opt, cb );
}
 
// This his how we call it
playGameSound('enemy', {loop: true, sound: 0.5})


//Take a close look at this piece of code GAME.audio_src[name] = src; – we’re doing this so that we can stop the sound, whenever we want to, pretty easily. We store the source buffer object in the audio_src object by the name and later when we want to stop it, we just call stopSound with the same object.

stopSound(GAME.audio_src[name]);

//Hopefully, you get the entire idea of using the web audio API to play multiple audio in Webkit browsers now! This really works well in iOS safari/chrome. But remember, it is only supported in iOS 6 (with safari 6), but not iOS 5. Supporting flawless audio playback in iOS 5 is still a pain. We simply decided to give up on it.
*/