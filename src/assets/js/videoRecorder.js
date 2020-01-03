export default function VideoRecorder(params) {
  const {
    $targetRecorderContainer,
    $targetRecordButton,
    $targetVideoPreview
  } = params;
  let data = params.data || {};
  let streamObject;
  let videoRecorder;

  this.handleVideoData = event => {
    const { data: videoFile } = event;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile);
    link.download = "recorded.webm";
    document.body.appendChild(link);
    link.click();
  };

  this.stopRecording = () => {
    videoRecorder.stop();
    $targetRecordButton.removeEventListener("click", this.stopRecording);
    $targetRecordButton.addEventListener("click", this.getVideo);
    data.recordButton = "Start recording";
    this.render();
  };

  const startRecording = () => {
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", this.handleVideoData);
    $targetRecordButton.addEventListener("click", this.stopRecording);
  };

  this.getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 }
      });
      $targetVideoPreview.srcObject = stream;
      $targetVideoPreview.muted = true;
      $targetVideoPreview.play();
      data.recordButton = "Stop recording";
      streamObject = stream;
      startRecording();
    } catch (error) {
      data.recordButton = "☹️ Cant record";
    } finally {
      $targetRecordButton.removeEventListener("click", this.getVideo);
      this.render();
    }
  };

  this.init = () => {
    $targetRecordButton.addEventListener("click", this.getVideo);
  };

  this.setState = nextData => {
    data = nextData;
    this.render();
  };

  this.render = () => {
    $targetRecordButton.innerHTML = data.recordButton;
  };

  if ($targetRecorderContainer) {
    this.init();
    this.render();
  }
}
