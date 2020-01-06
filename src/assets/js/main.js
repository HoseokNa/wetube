import axios from "axios";
import "../scss/styles.scss";
import App from "./App";

(async () => {
  const response = await axios({
    url: `/api/user/logged`,
    method: "GET"
  });
  const loggedUserId = response.data._id;

  const app = new App({
    loggedUserId
  });
})();
