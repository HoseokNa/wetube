import axios from "axios";

export default function Comment(params) {
  const {
    $targetCommentForm,
    $targetCommentList,
    $targetCommentNumber
  } = params;
  let data = params.data || {};

  this.deleteComment = async (index) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
      url: `/api/delete/${videoId}/comment`,
      method: "POST",
      data: {
        index
      }
    });
    if (response.status === 200) {
      data.commentNumber -= 1;
      data.deletedCommentIndex = index;
      console.log(index)
      console.log(data.deletedCommentIndex)
      this.render()
    }
  }

  $targetCommentList.addEventListener("click", e => {
    const { index } = e.target.closest('li').dataset

    if (e.target.className === 'comment__remove') {
      e.stopPropagation()
      this.deleteComment(index)
    }
  })

  this.increaseNumber = () => {
    (data.commentNumber += 1)
  };

  this.addComment = comment => {
    data.comment = comment
    this.increaseNumber();
    this.render()
  };

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
      this.addComment(comment);
    }
  };

  this.setState = nextData => {
    data = nextData
    this.render();
  }

  this.render = () => {
    $targetCommentNumber.innerHTML = data.commentNumber
    if(data.deletedCommentIndex !== -1){
      $targetCommentList.removeChild($targetCommentList.childNodes[data.deletedCommentIndex]) 
    }
    if(data.comment.length > 0){
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.innerHTML = data.comment;
      li.appendChild(span);
      $targetCommentList.prepend(li);
    }
  }

  if ($targetCommentForm) {
    this.render()
  }
}
