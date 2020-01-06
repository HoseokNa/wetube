import express from "express";
import routes from "../routes";
import {
  postRegisterView,
  postAddComment,
  postDeleteComment,
  getComments
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.comment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);
apiRouter.get(routes.comment, getComments);

export default apiRouter;
