import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PrivacySelect from "../PrivacySelect/PrivacySelect";
import { getPrivacyOption } from "../../constants/privacy";
import { updatePost } from "../EditPost/UpdatePost.services";

function PostPrivacy({
  postId,
  privacy,
  isOwner,
}: {
  postId: string;
  privacy: string;
  isOwner: boolean;
}) {
  const [value, setValue] = useState(privacy);
  const queryClient = useQueryClient();

  useEffect(() => setValue(privacy), [privacy]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (next: string) => updatePost(postId, { privacy: next }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", postId] });
    },
  });

  async function handleChange(next: string) {
    const previous = value;
    setValue(next); 
    try {
      await toast.promise(mutateAsync(next), {
        loading: "Updating privacy...",
        success: "Privacy updated",
        error: (err) => err.message,
      });
    } catch {
      setValue(previous); 
    }
  }

  if (!isOwner) {
    const option = getPrivacyOption(value);
    const Icon = option.icon;
    return (
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <Icon size="14" color="currentColor" />
        {option.label}
      </span>
    );
  }

  return <PrivacySelect value={value} onChange={handleChange} disabled={isPending} />;
}

export default PostPrivacy;