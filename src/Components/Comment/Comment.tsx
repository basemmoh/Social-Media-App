import { Avatar } from "@heroui/react";
import type { TopComment2 } from "../../Pages/Posts/Posts.interface";
import { timeAgo } from "../../utils/timeAgo";
import { Link } from "react-router";

function Comment({ comment }: { comment: TopComment2 }) {
  const {
    commentCreator: { _id: creatorId, name, photo },
    content,
    createdAt,
    image,
  } = comment;

  return (
    <div className="flex gap-3">
      <Link to={`/profile/${creatorId}`}>
        <Avatar size="sm">
          <Avatar.Image alt={name} src={photo} />
          <Avatar.Fallback>{name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0 bg-white rounded-xl border p-3">
        <p className="text-sm font-semibold">
          <Link to={`/profile/${creatorId}`} className="hover:underline">
            {name}
          </Link>{" "}
          <span className="font-normal text-gray-400">
            {timeAgo(createdAt)}
          </span>
        </p>
        <p className="text-sm">{content}</p>
        {image && <img src={image} alt="" className="mt-2 w-full rounded-lg" />}
      </div>
    </div>
  );
}

export default Comment;
