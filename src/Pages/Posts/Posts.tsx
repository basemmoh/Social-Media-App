import PostsFeed from "../../Components/PostsFeed/PostsFeed";
import { fetchAllPosts } from "./PostLists.services";

function Posts() {
  return (
    <PostsFeed title="Feed"
      queryKey={["allPosts"]}
      fetchPage={fetchAllPosts}
      showComposer
      emptyText="No posts yet."
    />
  );
}

export default Posts;