import "../scss/styles.scss";
import VideoPlayer from "./VideoPlayer";
import VideoRecorder from "./VideoRecorder";
import "./addComment";

const videoPlayer = new VideoPlayer({
  $targetVideoContainer: document.getElementById("jsVideoPlayer"),
  $targetVideoPlayer: document.querySelector("#jsVideoPlayer video"),
  $targetPlayButton: document.getElementById("jsPlayButton"),
  $targetVolumeButton: document.getElementById("jsVolumeBtn"),
  $targetFullScreenButton: document.getElementById("jsFullScreen"),
  $targetCurrentTime: document.getElementById("currentTime"),
  $targetTotalTime: document.getElementById("totalTime"),
  $targetVolumeRange: document.getElementById("jsVolume"),
  data: {
    volumeButton: `<i class="fas fa-volume-up"></i>`,
    currentTime: "00:00:00",
    totalTime: "00:00:00",
    playButton: `<i class="fas fa-play"></i>`,
    fullScreenButton: `<i class="fas fa-expand"></i>`
  }
});

const videoRecorder = new VideoRecorder({
  $targetRecorderContainer: document.getElementById("jsRecordContainer"),
  $targetRecordButton: document.getElementById("jsRecordBtn"),
  $targetVideoPreview: document.getElementById("jsVideoPreview"),
  data: {
    recordButton: "Start Recording"
  }
});
