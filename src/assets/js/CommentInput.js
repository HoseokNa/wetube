export default function CommentInput(params) {
  const { $target, sendComment, loggedUserId } = params;

  if (!loggedUserId) {
    $target.value = "Please Log In";
    $target.disabled = true;
  }

  $target.addEventListener("keydown", e => {
    const ENTER_KEY_CODE = 13;
    if (e.keyCode === ENTER_KEY_CODE) {
      e.preventDefault();
      sendComment($target.value);
      $target.value = "";
    }
  });
}
