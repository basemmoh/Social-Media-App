import { useContext, useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@heroui/react";
import { Like1, MessageText1, Repeat } from "iconsax-reactjs";
import type { Post } from "../../Pages/Posts/Posts.interface";
import Comment from "../Comment/Comment";
import { getAllComments } from "../Comment/Comments.services";
import CreateComment from "../CreateComment/CreateComment";
import EditPost from "../EditPost/EditPost";
import PostMenu from "../PostMenu/PostMenu";
import ShareButton from "../ShareButton/ShareButton";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useLike } from "../../Hooks/useLike/useLike";
import { timeAgo } from "../../utils/timeAgo";
import PostPrivacy from "../PostPrivacy/PostPrivacy";

// links to the details page in the feed, plain content on the details page
function MaybeLink({
  to,
  enabled,
  children,
}: {
  to: string;
  enabled: boolean;
  children: React.ReactNode;
}) {
  return enabled ? (
    <Link to={to} className="block">
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
}

function PostsCard({
  post,
  PostDetails,
}: {
  post: Post;
  PostDetails?: boolean;
}) {
  const {
    _id,
    commentsCount,
    likes,
    likesCount,
    sharesCount,
    sharedPost,
    createdAt,
    privacy,
    user: { _id: authorId, name, username, photo },
    body,
    image,
    topComment,
  } = post;

  const { userData } = useContext(userAuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const isOwner = !!userData && userData._id === authorId;
  const detailsPath = `/postDetails/${_id}`;
  const { liked, count, toggle } = useLike(_id, likes, likesCount);

  const { data: allComments, isLoading: loadingComments } = useQuery({
    queryKey: ["comments", _id],
    queryFn: () => getAllComments(_id),
    enabled: !!PostDetails || showComposer,
  });

  const actionClass =
    "flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full";
  return (
    <article className="w-full max-w-3xl bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 p-4">
        <Link to={`/profile/${authorId}`} aria-label={`${name}'s profile`}>
          <Avatar>
            <Avatar.Image alt={name} src={photo} />
            <Avatar.Fallback>{name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>
        </Link>
        <div className="min-w-0">
          <h2 className="font-semibold leading-tight">
            <Link to={`/profile/${authorId}`} className="hover:underline">
              {name}
            </Link>
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
            <Link to={`/profile/${authorId}`} className="hover:underline">
              @{username}
            </Link>
            <span>·</span>
            <span>{timeAgo(createdAt)}</span>
            <span>·</span>
            <PostPrivacy postId={_id} privacy={privacy} isOwner={isOwner} />
          </div>
        </div>
        {!isEditing && (
          <div className="ml-auto">
            <PostMenu
              postId={_id}
              isOwner={isOwner}
              canEdit={!post.isShare}
              bookmarked={post.bookmarked}
              onEdit={() => setIsEditing(true)}
              onDetailsPage={PostDetails}
            />
          </div>
        )}
      </header>

      {/* The edit box */}
      {(body || isEditing) && (
        <div className="px-4 pb-3">
          {isEditing ? (
            <EditPost
              postId={_id}
              initialBody={body ?? ""}
              initialImage={image}
              onClose={() => setIsEditing(false)}
            />
          ) : (
            <MaybeLink to={detailsPath} enabled={!PostDetails}>
              <p className="whitespace-pre-wrap">{body}</p>
            </MaybeLink>
          )}
        </div>
      )}

      {/* Original post inside a share */}
      {post.isShare && sharedPost && (
        <div className="mx-4 mb-3 border rounded-xl p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Avatar size="sm">
              <Avatar.Image
                alt={sharedPost.user.name}
                src={sharedPost.user.photo}
              />
              <Avatar.Fallback>
                {sharedPost.user.name.slice(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
            <Link
              to={`/profile/${sharedPost.user._id}`}
              className="text-sm font-medium hover:underline"
            >
              {sharedPost.user.name}
            </Link>
          </div>
          <p>{sharedPost.body}</p>
          {sharedPost.image && (
            <img
              src={sharedPost.image}
              className="w-full mt-2 rounded"
              alt=""
            />
          )}
          <Link
            to={`/postDetails/${sharedPost._id}`}
            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
          >
            View original post
          </Link>
        </div>
      )}

      {/* Image */}
      {image && !isEditing && (
        <MaybeLink to={detailsPath} enabled={!PostDetails}>
          <img
            src={image}
            alt={body ?? "Post image"}
            className="w-full max-h-128 object-cover"
          />
        </MaybeLink>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span className="grid place-items-center size-6 rounded-full bg-blue-600">
            <Like1 size="14" color="#fff" variant="Bold" />
          </span>
          {count} likes
        </span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Repeat size="16" color="currentColor" />
            {sharesCount} shares
          </span>
          <span>{commentsCount} comments</span>
          {!PostDetails && (
            <Link
              to={detailsPath}
              className="font-medium text-blue-600 hover:underline"
            >
              View details
            </Link>
          )}
        </span>
      </div>

      <div className="mx-4 border-t" />

      {/* Actions */}
      <div className="grid grid-cols-3 gap-1 px-2 py-1">
        <button
          type="button"
          onClick={toggle}
          className={`${actionClass} ${
            liked ? "text-blue-600 font-medium" : "text-gray-600"
          }`}
        >
          <Like1
            size="22"
            color={liked ? "#2563eb" : "#4b5563"}
            variant={liked ? "Bold" : "Outline"}
          />
          Like
        </button>

        <button
          type="button"
          className={actionClass}
          onClick={() =>
            PostDetails
              ? commentsRef.current?.scrollIntoView({ behavior: "smooth" })
              : setShowComposer(!showComposer)
          }
        >
          <MessageText1 size="22" color="currentColor" />
          Comment
        </button>

        <ShareButton postId={_id} />
      </div>

      {/* Comments */}
      {PostDetails || showComposer ? (
        <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
          {loadingComments && (
            <p className="text-sm text-gray-500">Loading comments...</p>
          )}
          {!loadingComments && allComments?.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
          {allComments?.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
          <div ref={commentsRef}>
            <CreateComment postId={_id} />
          </div>
        </div>
      ) : (
        topComment && (
          <div className="mx-4 mb-4 rounded-xl border bg-gray-50 p-3">
            <p className="text-xs font-semibold tracking-wide text-gray-500 mb-2">
              TOP COMMENT
            </p>
            <Comment comment={topComment} />
          </div>
        )
      )}
    </article>
  );
}

export default PostsCard;
