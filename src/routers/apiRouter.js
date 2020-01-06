import express from "express";
import routes from "../routes";
import {getLoggedUser} from "../controllers/userController";
import {
  postRegisterView,
  postAddComment,
  deleteComment,
  getComments
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.get(routes.loggedUser, getLoggedUser)
apiRouter.get(routes.comment, getComments);

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.comment, postAddComment)
;
apiRouter.delete(routes.certainComment, deleteComment);

export default apiRouter;
