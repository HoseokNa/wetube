import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;

  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          model: "User",
          path: "creator"
        }
      });
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const getComments = async (req, res) => {
  const {
    params: { id }
  } = req;
  let comments = null;
  try {
    const video = await Video.findById(id)
    .populate({
      path: "comments",
      populate: {
        model: "User",
        path: "creator"
      }
    })
    .populate({
      path: "comments",
      populate: {
        model: "Comment",
        path: "reComment",
        populate: {
          model: "User",
          path: "creator"
        }
      }
    });
    comments = video.comments;
  } catch (error) {
    res.status(400);
  } finally {
    res.json(comments.reverse());
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddReComment = async (req, res) => {
  const {
    params: { id },
    body: { reComment },
    user
  } = req;
  try {
    const comment = await Comment.findById(id);
    const newReComment = await Comment.create({
      text: reComment,
      creator: user.id
    });
    comment.reComment.push(newReComment.id);
    comment.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const deleteComment = async (req, res) => {
  const {
    params: { id, index }
  } = req;
  try {
    const video = await Video.findById(id);
    const deleteCommentId = video.comments.reverse()[index];
    video.comments.splice(index, 1);
    await Comment.findByIdAndDelete(deleteCommentId, err => {
      if (err) throw err;
      video.comments.reverse();
      video.save();
    });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const deleteReComment = async (req, res) => {
  const {
    params: { id, index }
  } = req;
  try {
    const comment = await Comment.findById(id);
    await Comment.findByIdAndDelete(comment.reComment[index], err => {
        if (err) throw err;
        comment.save();
      });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
