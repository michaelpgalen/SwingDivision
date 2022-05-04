
const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const rhythmSelector = document.querySelector('#rhythmSelector');

const sounds = {
  click3: new Howl({
    src: '/click3.mp3'
  }),
  click4: new Howl({
    src: '/click4.mp3'
  })
}

// 1 min = 60_000 ms
// 60_000 / bpm = duration of quarter note
// 60_000 / bpm / 4 = duration of 1/16 note
let bpm = 100; 
let subdivisions = rhythmSelector.value;
let msTempo = (60000 / bpm) / subdivisions;
let beatCount = 0;

let isRunning = false;
let tempoTextString = 'medium';

tempoSlider.addEventListener('input', () => {
  bpm = tempoSlider.value;
  updateTempo();
});
decreaseTempoBtn.addEventListener('click', () => {
  if (bpm <= 20) { return };
  bpm--;
  updateTempo();
});
increaseTempoBtn.addEventListener('click', () => {
  if (bpm >= 200) { return };
  bpm++;
  updateTempo();
});
rhythmSelector.addEventListener('change', () => {
  beatCount = 0;
  updateTempo();
});
startStopBtn.addEventListener('click', () => {
  if (!isRunning) {
    startMetronome();
    startStopBtn.textContent = 'STOP';
    isRunning = true;
  } else if (isRunning) {
    stopMetronome();
    startStopBtn.textContent = 'START';
    isRunning = false;
  }
});

// Add accurate timer constructor function
function Timer(callback, timeInterval, errorCallback) {
    this.timeInterval = timeInterval;
    
    // Add method to start timer
    this.start = () => {
      // Set the expected time. The moment in time we start the timer plus whatever the time interval is. 
      this.expected = Date.now() + this.timeInterval;
      // Start the timeout and save the id in a property, so we can cancel it later
      this.timeout = setTimeout(this.round, this.timeInterval);
      console.log('Timer Started');
    }
    // Add method to stop timer
    this.stop = () => {
      clearTimeout(this.timeout);
      console.log('Timer Stopped');
    }
    
    // Round method that takes care of running the callback and adjusting the time
    this.round = () => {
      // console.log('timeout', this.timeout);
      // The drift will be the current moment in time for this round minus the expected time.
      let drift = Date.now() - this.expected;
      // Run error callback if drift is greater than time interval, and if the callback is provided
      if (drift > this.timeInterval) {
        // If error callback is provided
        if (errorCallback) {
          errorCallback();
        }
      }
      callback();
      // Increment expected time by time interval for every round after running the callback function.
      this.expected += this.timeInterval;
      // console.log('Drift:', drift);
      // console.log('Next round time interval:', this.timeInterval - drift);
      // Run timeout again and set the timeInterval of the next iteration to the original time interval minus the drift.
      this.timeout = setTimeout(this.round, this.timeInterval - drift);
    }
  }

// update metronome tempo settings
function updateTempo() {
  if (rhythmSelector.value === 'samba') {
    subdivisions = drumTracks.samba.subdivisions;
  }
  if (rhythmSelector.value === 'drunkFunk') {
    subdivisions = drumTracks.drunkFunk.subdivisions;
  }
  tempoDisplay.textContent = bpm;
  // tempoDisplay.textContent = tempoSlider.value;
  drumLoop.timeInterval = (60000 / bpm) / subdivisions;
  tempoSlider.value = bpm;
};

const drumTracks = {
 samba: { 
  subdivisions: 9,  
  trackMatrix: [2,0,1, 0,1,0, 2,0,0],
  },
  drunkFunk: {
    subdivisions: 5,
    trackMatrix: [2,0,1,1,0]
  }
}

function drumstToPlay() {
  // using drumTracks object
  // samba
  if (rhythmSelector.value === 'samba') {
    subdivisions = drumTracks.samba.subdivisions;
    if (drumTracks.samba.trackMatrix[beatCount] === 1) {
      sounds.click3.play();
    }
    if (drumTracks.samba.trackMatrix[beatCount] === 2) {
      sounds.click4.play();
    }
  }
  // drunkFunk
  if (rhythmSelector.value === 'drunkFunk') {
    subdivisions = drumTracks.drunkFunk.subdivisions;
    if (drumTracks.drunkFunk.trackMatrix[beatCount] === 1) {
      sounds.click3.play();
    }
    if (drumTracks.drunkFunk.trackMatrix[beatCount] === 2) {
      sounds.click4.play();
    }
  }  
  beatCount++
  if (beatCount === subdivisions) {beatCount = 0}
  // console.log('beat count is', beatCount)
}

const drumLoop = new Timer(drumstToPlay, msTempo, () => console.log('error!')
);

function startMetronome() {
  beatCount = 0;
  updateTempo();
  drumLoop.start();
}
function stopMetronome() {
  beatCount = 0;
  drumLoop.stop();
}