export const reCommentTemplate = (loggedUserId, reComment, index) => {
  console.log(reComment);
  const reCommentHTML = `
    <li data-index=${index}>
      <div class="comment__main">
        <img class="comment__avatarUrl" src=${reComment.creator.avatarUrl}>
        <div class="comment__contents">
          <div class="contents__creator">${reComment.creator.name}</div>
          <div class="contents__text">${reComment.text}</div>
        </div>
          ${
            loggedUserId === reComment.creator._id
              ? `<button class="comment__remove">❌</button>`
              : ``
          }
      </div>
    </li>`;

  return reCommentHTML;
};

export const commentTemplate = (loggedUserId, comment, index) => {
  const reCommentHTML = `<ul class="comment__reComment">${comment.reComment
    .map((reComment, index) => {
      return reCommentTemplate(loggedUserId, reComment, index);
    })
    .join("")}</ul>`;

  const commentHTML = `
      <li data-index=${index}>
        <div class="comment__main">
          <img class="comment__avatarUrl" src=${comment.creator.avatarUrl}>
          <div class="comment__contents">
            <div class="contents__creator">${comment.creator.name}</div>
            <div class="contents__text">${comment.text}</div>
          </div>
          ${
            loggedUserId === comment.creator._id
              ? `<button class="comment__remove">❌</button>`
              : ``
          }
        </div>
        <div class="comment__footer">
          <span class="recomment-request">답글</span>
        </div>
        <input class="comment__input" type="text" />
        ${reCommentHTML}
      </li>`;

  return commentHTML;
};
