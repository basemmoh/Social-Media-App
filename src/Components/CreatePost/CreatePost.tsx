import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@heroui/react";
import { DocumentUpload } from "iconsax-reactjs";
import toast from "react-hot-toast";
import PrivacySelect from "../PrivacySelect/PrivacySelect";
import type { UserData } from "../../Context/UserAuthProvider/UserAuthProvider.inteface";
import { createPost } from "./CreatePost.services";

function CreatePost({ userData }: { userData: UserData }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { body: "" },
  });

  const [privacy, setPrivacy] = useState("public");
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // free the preview URL when it changes or the card unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
  });

  function clearImage() {
    setImgSrc(null);
    setPreview(undefined);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleUserPost(data: { body: string }) {
    const formData = new FormData();
    formData.append("body", data.body);
    formData.append("privacy", privacy);
    if (imgSrc) formData.append("image", imgSrc);

    try {
      await toast.promise(mutateAsync(formData), {
        loading: "Creating Post...",
        success: (res) => res,
        error: (err) => err?.response?.data?.message ?? "Couldn't create post",
      });
      reset();
      clearImage();
    } catch {
      // failed: keep what the user typed so they can retry
    }
  }

  const hasContent = !!watch("body")?.trim() || !!imgSrc;

  return (
    <div className="w-full bg-main-color/40 rounded-2xl shadow-md p-4 sm:p-5">
      <p className="font-semibold pb-3 border-b border-black/10 mb-3">
        Hello {userData.name}, What's on your mind?
      </p>

      <form
        onSubmit={handleSubmit(handleUserPost)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="shrink-0">
            <Avatar.Image alt={userData.name} src={userData.photo} />
            <Avatar.Fallback>
              {userData.name.slice(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar>

          <input
            {...register("body")}
            placeholder="What's on your mind?"
            className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 outline-none"
          />

          <button
            type="button"
            aria-label="Add photo"
            onClick={() => fileInput.current?.click()}
            className="shrink-0 cursor-pointer"
          >
            <DocumentUpload size="30" color="#2563eb" />
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImgSrc(file);
              setPreview(URL.createObjectURL(file));
              e.target.value = ""; // lets you pick the same file again later
            }}
          />
        </div>

        <PrivacySelect value={privacy} onChange={setPrivacy} />

        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt=""
              className="w-full max-h-72 object-cover rounded-xl"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={clearImage}
              className="absolute top-2 right-2 size-8 grid place-items-center rounded-full bg-black/60 text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={!hasContent || isPending}
          className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
