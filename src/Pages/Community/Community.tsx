import PostsFeed from "../../Components/PostsFeed/PostsFeed";
import { fetchCommunityPosts } from "../Posts/PostLists.services";

function Community() {
  return (
    <PostsFeed title="Community"
      queryKey={["allPosts", "community"]}
      fetchPage={fetchCommunityPosts}
      showComposer
      emptyText="No posts from you or the people you follow yet."
    />
  );
}

export default Community;