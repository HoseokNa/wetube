/* eslint-disable import/prefer-default-export */
import axios from "axios";

const request = async (url, method, data) => {
  try {
    const response = await axios({
      url,
      method,
      data
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const api = {
  // User
  getLoggedUser: async () => request(`/api/user/logged`, "GET"),
  // Comment
  getComments: async videoId => request(`/api/${videoId}/comment`, "GET"),
  postComment: async (videoId, data) => request(`/api/${videoId}/comment`, "POST", data),
  deleteComment: async (videoId, index) => request(`/api/${videoId}/comment/${index}`, "DELETE"),
  postReComment: async (commentId, reComment) => request(`/api/${commentId}/recomment`, "POST", reComment),
  // View
  postView: async videoId => request(`/api/${videoId}/view`, "POST")
};
