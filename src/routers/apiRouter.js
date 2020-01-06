import express from "express";
import routes from "../routes";
import {
  postRegisterView,
  postAddComment,
  deleteComment,
  getComments
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.comment, postAddComment);
apiRouter.delete(routes.certainComment, deleteComment);
apiRouter.get(routes.comment, getComments);

export default apiRouter;
