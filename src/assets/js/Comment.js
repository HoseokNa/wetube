import { commentTemplate } from "./utils.js/template";

export default function Comment(params) {
  const {
    $targetCommentForm,
    $targetCommentList,
    $targetCommentNumber,
    api
  } = params;
  let data = params.data || {};

  this.getComments = async () => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await api.getComments(videoId);
    data.comments = response.data;
    console.log(data.comments);
  };

  this.deleteComment = async index => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await api.deleteComment(videoId, index);
    if (response.status === 200) {
      await this.getComments();
      this.render();
    }
  };

  $targetCommentList.addEventListener("click", e => {
    const { index } = e.target.closest("li").dataset;

    if (e.target.className === "comment__remove") {
      e.stopPropagation();
      this.deleteComment(index);
    }

    if (e.target.className === "recomment-request") {
      e.stopPropagation();
      if(e.toElement.parentElement.parentElement.children[2].style.display === "block"){
        e.toElement.parentElement.parentElement.children[2].style.display = "none"
      } else {
        e.toElement.parentElement.parentElement.children[2].style.display = "block";
      }
    }
  });

  $targetCommentList.addEventListener("keydown", e => {
    if (e.target.className === "comment__input") {
      if (e.key === "Enter") {
        const { index } = e.path[1].dataset;
        this.sendReComment(e.target.value, index);
      }
    }
  });

  this.sendReComment = async (reComment, index) => {
    const commentId = data.comments[index]._id;
    console.log(commentId);
    const response = await api.postReComment(commentId, { reComment });
    if (response.status === 200) {
      await this.getComments();
      this.render();
    }
  };

  this.sendComment = async comment => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await api.postComment(videoId, { comment });
    if (response.status === 200) {
      await this.getComments();
      this.render();
    }
  };

  this.setState = nextData => {
    data = nextData;
    this.render();
  };

  this.render = () => {
    if (data.comments) {
      $targetCommentNumber.innerHTML = data.comments.length;
      $targetCommentList.innerHTML = data.comments
        .map((comment, index) => {
          return commentTemplate(data.loggedUserId, comment, index);
        })
        .join("");
    }
  };

  if ($targetCommentForm) {
    this.render();
  }
}
