import { useContext } from "react";
import PostsFeed from "../../Components/PostsFeed/PostsFeed";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { fetchUserPosts } from "../Posts/PostLists.services";

function MyPosts() {
  const { userData } = useContext(userAuthContext);
  const userId = userData?._id;

  return (
    <PostsFeed title="My Posts"
      queryKey={["allPosts", "mine", userId]}
      fetchPage={(page) => fetchUserPosts(userId!, page)}
      enabled={!!userId}
      showComposer
      emptyText="You haven't posted anything yet."
    />
  );
}

export default MyPosts;