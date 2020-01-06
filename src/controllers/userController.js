import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import { flashMessage } from "../constants";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash("error", flashMessage.NOT_MATCH_PASSWORD);
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: flashMessage.SUCCESS_LOG_IN,
  failureFlash: flashMessage.FAIL_LOG_IN
});

export const githubLogin = passport.authenticate("github", {
  successFlash: flashMessage.SUCCESS_LOG_IN,
  failureFlash: flashMessage.FAIL_LOG_IN
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook", {
  successFlash: flashMessage.SUCCESS_LOG_IN,
  failureFlash: flashMessage.FAIL_LOG_IN
});

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: flashMessage.SUCCESS_LOG_IN,
  failureFlash: flashMessage.FAIL_LOG_IN
});

export const kakaoLoginCallback = async (_, __, profile, done) => {
  const {
    username: name,
    _json: {
      id,
      properties: { profile_image: avatarUrl },
      kakao_account: { email }
    }
  } = profile;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.avatarUrl = avatarUrl;
      user.save();
      return done(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", flashMessage.SUCCESS_LOG_OUT);
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", flashMessage.FAIL_FIND_USER);
    res.redirect(routes.home);
  }
};

export const getLoggedUser = async (req, res) => {
  res.json(req.user);
}

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash("success", flashMessage.SUCCESS_UPDATE_PROFILE);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", flashMessage.FAIL_UPDATE_PROFILE);
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", flashMessage.NOT_MATCH_PASSWORD);
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", flashMessage.FAIL_CHANGE_PASSWORD);
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
