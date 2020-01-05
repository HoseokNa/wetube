import VideoPlayer from "./VideoPlayer";
import VideoRecorder from "./VideoRecorder";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

export default function App() {
  const videoPlayer = document.getElementById("jsVideoPlayer")
    ? new VideoPlayer({
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
        },
        plusViewCounts: (videoId) => {
          fetch(`/api/${videoId}/view`, {
            method: "POST"
          });
        }
      })
    : null;

  const videoRecorder = document.getElementById("jsRecordContainer")
    ? new VideoRecorder({
        $targetRecorderContainer: document.getElementById("jsRecordContainer"),
        $targetRecordButton: document.getElementById("jsRecordBtn"),
        $targetVideoPreview: document.getElementById("jsVideoPreview"),
        data: {
          recordButton: "Start Recording"
        }
      })
    : null;

  const comment = document.getElementById("jsAddComment")
    ? new Comment({
        $targetCommentForm: document.getElementById("jsAddComment"),
        $targetCommentList: document.getElementById("jsCommentList"),
        $targetCommentNumber: document.getElementById("jsCommentNumber")
      })
    : null;

  const commentInput = document.getElementById("jsAddComment")
    ? new CommentInput({
        $target: document.getElementById("jsAddComment").querySelector("input"),
        sendComment: comment.sendComment
      })
    : null;

  let data = {
    dataComment: comment ? comment.data : null,
    dataVideoPlayer: videoPlayer ? videoPlayer.data : null,
    dataVideoRecorder: videoRecorder ? videoRecorder.data : null
  };

  this.setState = nextData => {
    data = nextData;
    comment.setState(data.dataComment);
    videoPlayer.setState(data.dataVideoPlayer);
    videoPlayer.setState(data.dataVideoRecorder);
    this.render();
  };

  this.render = () => {
    if (comment) {
      comment.render();
    }
    if (videoPlayer) {
      videoPlayer.render();
    }
    if (videoRecorder) {
      videoRecorder.render();
    }
  };

  this.render();
}
