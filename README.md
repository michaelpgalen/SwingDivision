# SwingDivision

## A metronome app helping musicians improve their genre specific swing feels

### Getting started
 - Clone this repository or download the zip folder.
 - Open index.html
 - Enjoy!

SwingDivision addresses the imprecise nature of the setTimeout() method by creating a recursive metronome function that adjusts for drift at each interval. It does this by temporarily storing the current time at each metronome click, as well as storing the projected time of the next click, given the user's bpm settings. When the next click (and thus setTimeout) occurs, the new currentTime is compared with the projectedTime of the previous click. Any difference is added/subtracted to the next setTimeout to make up for the tiny drift. This the metronome percievably steady.

Additionally, the special swing of Samba required a binary array with a length of 80. Four 1's were spaced out among the 0's to trigger sound samples at the swing feel of Samba.
