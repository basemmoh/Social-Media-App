import { useParams } from "react-router";
import PostsCard from "../../Components/PostsCard/PostsCard";
import Loading from "../../Components/Loading/Loading";
import { usePostDetails } from "../../Hooks/usePostDetails/usePostDetails";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

function PostDetails() {
  useDocumentTitle("Post Details");
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = usePostDetails(id);
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <h1 className=" text-6xl text-red-500">{error!.message}</h1>;
  }

  return (
    <>
      <div className="md:w-3xl">
        <PostsCard post={data!} PostDetails />
      </div>
    </>
  );
}

export default PostDetails;
