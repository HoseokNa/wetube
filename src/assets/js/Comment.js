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
  });

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
          const htmlString =
            data.loggedUserId === comment.creator._id
              ? `<li data-index=${index}><img class="comment__avatarUrl" src=${comment.creator.avatarUrl}><div class="comment__contents"><div class="contents__creator">${comment.creator.name}</div><div class="contents__text">${comment.text}</div></div><button class="comment__remove">❌</button></li>`
              : `<li data-index=${index}><img class="comment__avatarUrl" src=${comment.creator.avatarUrl}><div class="comment__contents"><div class="contents__creator">${comment.creator.name}</div><div class="contents__text">${comment.text}</div></div>`;
          return htmlString;
        })
        .join("");
    }
  };

  if ($targetCommentForm) {
    this.render();
  }
}
