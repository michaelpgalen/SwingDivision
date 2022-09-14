
const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const rhythmSelector = document.querySelector('#rhythmSelector');

const sounds = {
  kickCabasa: new Howl({
    src: 'kick-cabasa.wav'
  }),
  cabasa: new Howl({
    src: 'cabasa.wav'
  }),
  clap: new Howl({
    src: 'clap.wav'
  }),
  repique1: new Howl({
    src: 'repique1_1.wav'
  }),
  repique2: new Howl({
    src: 'repique2_1.wav'
  }),
  repique3: new Howl({
    src: 'repique3_1.wav'
  }),
  repique4: new Howl({
    src: 'repique4_1.wav'
  })
};

// 1 min = 60_000 ms
// 60_000 / bpm = duration of quarter note
// 60_000 / bpm / 4 = duration of 1/16 note
let bpm = 100;
let subdivisions = rhythmSelector.value;
let msTempo = (60000 / bpm) / subdivisions;
let beatCount = 0;
let measure = 0;

let isRunning = false;
let tempoTextString = 'medium';

tempoSlider.addEventListener('input', () => {
  bpm = tempoSlider.value;
  updateTempo();
});
decreaseTempoBtn.addEventListener('click', () => {
  if (bpm <= 50) { return };
  bpm--;
  updateTempo();
});
increaseTempoBtn.addEventListener('click', () => {
  if (bpm >= 150) { return };
  bpm++;
  updateTempo();
});
rhythmSelector.addEventListener('change', () => {
  beatCount = 0;
  measure = 0;
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

// samba matrix 80
const drumTracks = {
  samba: {
   subdivisions: 80,
   trackMatrix: [1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,2, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,3, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,4,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
   },
   drunkFunk: {
     subdivisions: 5,
     trackMatrix: {
       m0:[3,0,1,1,0],
       m1:[2,0,1,1,0]
     }
   }
 }

function drumstToPlay() {
  // using drumTracks object
  // samba
  if (rhythmSelector.value === 'samba') {
    subdivisions = drumTracks.samba.subdivisions;
    if (drumTracks.samba.trackMatrix[beatCount] === 1) {
      sounds.repique1.play();
    }
    if (drumTracks.samba.trackMatrix[beatCount] === 2) {
      sounds.repique2.play();
    }
    if (drumTracks.samba.trackMatrix[beatCount] === 3) {
      sounds.repique3.play();
    }
    if (drumTracks.samba.trackMatrix[beatCount] === 4) {
      sounds.repique4.play();
    }
  }
  // drunkFunk
  if (rhythmSelector.value === 'drunkFunk') {
    subdivisions = drumTracks.drunkFunk.subdivisions;
    if (measure === 0) {
      if (drumTracks.drunkFunk.trackMatrix.m0[beatCount] === 1) {
        sounds.cabasa.play();
      };
      if (drumTracks.drunkFunk.trackMatrix.m0[beatCount] === 2) {
        sounds.clap.play();
      };
      if (drumTracks.drunkFunk.trackMatrix.m0[beatCount] === 3) {
        sounds.kickCabasa.play();
      }
    }
    if (measure === 1) {
      if (drumTracks.drunkFunk.trackMatrix.m1[beatCount] === 1) {
        sounds.cabasa.play();
      };
      if (drumTracks.drunkFunk.trackMatrix.m1[beatCount] === 2) {
        sounds.clap.play();
      };
      if (drumTracks.drunkFunk.trackMatrix.m1[beatCount] === 3) {
        sounds.kickCabasa.play();
      }
    }
  }
  beatCount++
  measure++
  if (beatCount === subdivisions) {beatCount = 0}
  if (measure === 2) {measure = 0}
  // console.log('beat count is', beatCount)
};

const drumLoop = new Timer(drumstToPlay, msTempo, () => console.log('drift error!')
);

function startMetronome() {
  beatCount = 0;
  updateTempo();
  drumLoop.start();
  console.log(bpm);
}
function stopMetronome() {
  beatCount = 0;
  drumLoop.stop();
}
