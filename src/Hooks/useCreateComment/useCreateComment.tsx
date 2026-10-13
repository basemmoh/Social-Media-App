import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserComment } from "../../Components/CreateComment/CreateComment.services";

export function useCreateComment(imgSrc: File | null, postId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (data: { content: string }) => {
      const formData = new FormData();
      formData.append("content", data.content);
      if (imgSrc) formData.append("image", imgSrc);
      return createUserComment(formData, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", postId] }); // updates the comments count
    },
  });

  return (data: { content: string }) =>
    toast.promise(mutateAsync(data), {
      loading: "Creating Comment...",
      success: (message) => message,
      error: (err) => err?.response?.data?.message ?? "Couldn't create comment",
    });
}