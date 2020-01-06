import axios from "axios";

export default function Comment(params) {
  const {
    $targetCommentForm,
    $targetCommentList,
    $targetCommentNumber
  } = params;
  let data = params.data || {};

  this.getComments = async () => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
      url: `/api/${videoId}/comment`,
      method: "GET"
    });
    data.comments = JSON.parse(response.request.response);
  };

  this.deleteComment = async index => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
      url: `/api/${videoId}/comment/${index}`,
      method: "DELETE",
    });
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
  });

  this.sendComment = async comment => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
      url: `/api/${videoId}/comment`,
      method: "POST",
      data: {
        comment
      }
    });
    if (response.status === 200) {
      await this.getComments()
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
        .map(
          (comment, index) =>
            `<li data-index=${index}><span>${comment.text}</span><button class="comment__remove">❌</button></li>`
        )
        .join("");
    }
  };

  if ($targetCommentForm) {
    this.render();
  }
}
