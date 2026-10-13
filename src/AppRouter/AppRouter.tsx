import { createBrowserRouter } from "react-router";
import Login from "../Pages/Login/Login";
import Posts from "../Pages/Posts/Posts";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";
import Layout from "../Components/Layout/Layout";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import AuthProtected from "../Components/AuthProtected/AuthProtected";
import PostDetails from "../Pages/PostDetails/PostDetails";
import Settings from "../Pages/Settings/Settings";
import MyPosts from "../Pages/MyPosts/MyPosts";
import Community from "../Pages/Community/Community";
import Saved from "../Pages/Saved/Saved";
import Profile from "../Pages/Profile/Profile";
import Notifications from "../Pages/Notifications/Notifications";
import UserProfile from "../Pages/UserProfile/UserProfile";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Posts /> </ProtectedRoute>},
      { path: "/posts", element: <ProtectedRoute><Posts /> </ProtectedRoute>},
      { path: "/postDetails/:id", element: <ProtectedRoute><PostDetails /> </ProtectedRoute>},
      { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: "/my-posts", element: <ProtectedRoute><MyPosts /></ProtectedRoute> },
      { path: "/community", element: <ProtectedRoute><Community /></ProtectedRoute> },
      { path: "/saved", element: <ProtectedRoute><Saved /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      { path: "/profile/:id", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: "/login", element: <AuthProtected><Login /></AuthProtected> },
      { path: "/register", element: <AuthProtected><Register /></AuthProtected>  },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
