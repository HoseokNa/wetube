import "../scss/styles.scss";
import { api } from "./api";
import App from "./App";

(async () => {
  const response = await api.getLoggedUser();
  const loggedUserId = response.data._id;

  const app = new App({
    loggedUserId
  });
})();
