import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import KakaoStrategy from "passport-kakao";
import User from "./models/User";
import {
  githubLoginCallback,
  facebookLoginCallback,
  kakaoLoginCallback
} from "./controllers/userController";
import routes from "./routes";
import url from "./constants"

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `${url.PRODUCT_URL}${routes.githubCallback}`
        : `${url.LOCAL_URL}${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.PRODUCTION
      ? `${url.PRODUCT_URL}${routes.facebookCallback}`
      : `${url.LOCAL_URL}${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.PRODUCTION
        ? `${url.PRODUCT_URL}${routes.kakaoCallback}`
        : `${url.LOCAL_URL}${routes.kakaoCallback}`
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
