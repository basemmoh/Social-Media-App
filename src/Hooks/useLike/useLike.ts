import { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { toggleLike } from "../../Components/LikeButton/Like.services";

export function useLike(postId: string, likes: string[], likesCount: number) {
  const { userData } = useContext(userAuthContext);
  const serverLiked = !!userData && likes.includes(userData._id);

  const [liked, setLiked] = useState(serverLiked);
  const [count, setCount] = useState(likesCount);

  useEffect(() => {
    setLiked(serverLiked);
    setCount(likesCount);
  }, [serverLiked, likesCount]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: () => {
      const previous = { liked, count };
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
      return previous;
    },
    onSuccess: (res) => {
      setLiked(res.data.liked);
      setCount(res.data.likesCount);
    },
    onError: (_err, _vars, previous) => {
      if (previous) {
        setLiked(previous.liked);
        setCount(previous.count);
      }
      toast.error("Couldn't update like");
    },
  });

  return { liked, count, toggle: () => !isPending && mutate() };
}