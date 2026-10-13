import PostsFeed from "../../Components/PostsFeed/PostsFeed";
import { fetchBookmarks } from "../Posts/PostLists.services";

function Saved() {
  return (
    <PostsFeed title="Saved"
      queryKey={["allPosts", "saved"]}
      fetchPage={fetchBookmarks}
      emptyText="No saved posts yet. Use the ⋯ menu on a post to save it."
    />
  );
}

export default Saved;