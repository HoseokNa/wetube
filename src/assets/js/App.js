import VideoPlayer from "./VideoPlayer";
import VideoRecorder from "./VideoRecorder";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { api } from "./api";

export default function App(params) {
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
        $targetProgressBar: document.getElementById("jsProgressBar"),
        data: {
          volumeButton: `<i class="fas fa-volume-up"></i>`,
          currentTime: "00:00:00",
          totalTime: "00:00:00",
          playButton: `<i class="fas fa-play"></i>`,
          fullScreenButton: `<i class="fas fa-expand"></i>`,
          progressBar: 0
        },
        plusViewCounts: api.postView
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
        $targetCommentNumber: document.getElementById("jsCommentNumber"),
        api,
        data: {
          loggedUserId: params.loggedUserId
        }
      })
    : null;

  const commentInput = document.getElementById("jsAddComment")
    ? new CommentInput({
        $target: document.getElementById("jsAddComment").querySelector("input"),
        sendComment: comment.sendComment,
        loggedUserId: params.loggedUserId
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

  (async () => {
    if(comment){
      await comment.getComments();
      this.render();
    }
  })();
}
