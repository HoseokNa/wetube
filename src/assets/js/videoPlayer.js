import getBlobDuration from "get-blob-duration";

export default function VideoPlayer(params) {
  const {
    $targetVideoContainer,
    $targetVideoPlayer,
    $targetPlayButton,
    $targetVolumeButton,
    $targetFullScreenButton,
    $targetCurrentTime,
    $targetTotalTime,
    $targetVolumeRange
  } = params;
  let data = params.data || {};

  this.onClickPlay = () => {
    if ($targetVideoPlayer.paused) {
      $targetVideoPlayer.play();
      data.playButton = '<i class="fas fa-pause"></i>';
    } else {
      $targetVideoPlayer.pause();
      data.playButton = '<i class="fas fa-play"></i>';
    }
    this.render();
  };

  this.onClickVolume = () => {
    if ($targetVideoPlayer.muted) {
      $targetVideoPlayer.muted = false;
      data.volumeButton = '<i class="fas fa-volume-up"></i>';
      $targetVolumeRange.value = $targetVideoPlayer.volume;
    } else {
      $targetVolumeRange.value = 0;
      $targetVideoPlayer.muted = true;
      data.volumeButton = '<i class="fas fa-volume-mute"></i>';
    }
    this.render();
  };

  this.onClickFullScreen = () => {
    if ($targetVideoContainer.requestFullscreen) {
      $targetVideoContainer.requestFullscreen();
    } else if ($targetVideoContainer.mozRequestFullScreen) {
      $targetVideoContainer.mozRequestFullScreen();
    } else if ($targetVideoContainer.webkitRequestFullscreen) {
      $targetVideoContainer.webkitRequestFullscreen();
    } else if ($targetVideoContainer.msRequestFullscreen) {
      $targetVideoContainer.msRequestFullscreen();
    }
    data.fullScreenButton = '<i class="fas fa-compress"></i>';
    $targetFullScreenButton.removeEventListener(
      "click",
      this.onClickFullScreen
    );
    $targetFullScreenButton.addEventListener(
      "click",
      this.onClickExitFullScreen
    );
    this.render();
  };

  this.onClickExitFullScreen = () => {
    data.fullScreenButton = '<i class="fas fa-expand"></i>';
    $targetFullScreenButton.addEventListener("click", this.onClickFullScreen);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    this.render();
  };

  this.onEnded = () => {
    // Todo count views
    //registerView();
    $targetVideoPlayer.currentTime = 0;
    data.playButton = '<i class="fas fa-play"></i>';
    this.render();
  };

  this.onDragVolume = e => {
    const {
      target: { value }
    } = e;
    $targetVideoPlayer.volume = value;
    if (value >= 0.6) {
      data.volumeButton = '<i class="fas fa-volume-up"></i>';
    } else if (value > 0) {
      data.volumeButton = '<i class="fas fa-volume-down"></i>';
    } else {
      data.volumeButton = '<i class="fas fa-volume-mute"></i>';
    }
    this.render();
  };

  this.formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
      totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
  };

  this.setCurrentTime = () => {
    data.currentTime = this.formatDate(
      Math.floor($targetVideoPlayer.currentTime)
    );
    this.render();
  };

  this.setTotalTime = async () => {
    const duration = await getBlobDuration($targetVideoPlayer.src);
    const totalTimeString = this.formatDate(duration);
    data.totalTime = totalTimeString;
    setInterval(this.setCurrentTime, 1000);
  };

  this.init = () => {
    $targetVideoPlayer.volume = 0.5;
    $targetPlayButton.addEventListener("click", this.onClickPlay);
    $targetVolumeButton.addEventListener("click", this.onClickVolume);
    $targetFullScreenButton.addEventListener("click", this.onClickFullScreen);
    $targetVideoPlayer.addEventListener("ended", this.onEnded);
    $targetVolumeRange.addEventListener("input", this.onDragVolume);

    const timer = setInterval(() => {
      if ($targetVideoPlayer.readyState >= 2) {
        this.setTotalTime();
        clearInterval(timer);
      }
    }, 500);
  };

  this.setState = nextData => {
    data = nextData;
    this.render();
  };

  this.render = () => {
    $targetVolumeButton.innerHTML = data.volumeButton;
    $targetCurrentTime.innerHTML = data.currentTime;
    $targetTotalTime.innerHTML = data.totalTime;
    $targetPlayButton.innerHTML = data.playButton;
    $targetFullScreenButton.innerHTML = data.fullScreenButton;
  };

  if ($targetVideoContainer) {
    this.init();
    this.render();
  }
}
