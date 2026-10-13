import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePost } from "./UpdatePost.services";

function EditPost({
  postId,
  initialBody,
  initialImage,
  onClose,
}: {
  postId: string;
  initialBody: string;
  initialImage?: string;
  onClose: () => void;
}) {
  const [text, setText] = useState(initialBody);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const bodyChanged = text.trim() !== initialBody.trim();
  const imageChanged = !!newImage;
  const hasChanges = bodyChanged || imageChanged;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      updatePost(postId, {
        body: bodyChanged ? text.trim() : undefined,
        image: newImage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", postId] });
    },
  });

  function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = ""; 
  }
  function clearImage() {
    setNewImage(null);
    setPreview(undefined);
    if (fileInput.current) fileInput.current.value = "";
  }
  async function handleSave() {
    if (!text.trim() && !newImage && !initialImage) {
      toast.error("A post needs text or an image");
      return;
    }
    try {
      await toast.promise(mutateAsync(), {
        loading: "Saving...",
        success: (res) => {
          clearImage();
          onClose();
          return res.message;
        },
        error: (err) => err.message,
      });
    } catch {
    }
  }

  const shownImage = preview ?? initialImage;

  return (
    <div
      className="w-full flex flex-col gap-2"
      onClick={(e) => e.preventDefault()}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full border rounded px-2 py-1 text-sm"
        autoFocus
      />

      {shownImage && <img src={shownImage} className="w-full rounded" alt="" />}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickImage}
        onClick={(e) => e.stopPropagation()} 
      />

      <div className="flex gap-2 justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.current?.click();
          }}
          className="px-3 py-1 text-sm rounded border cursor-pointer"
        >
          {shownImage ? "Change image" : "Add image"}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="px-3 py-1 text-sm rounded border cursor-pointer"
          >
            Cancel
          </button>
          {newImage && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearImage();
              }}
              className="px-3 py-1 text-sm rounded border cursor-pointer"
            >
              Remove new image
            </button>
          )}
          <button
            type="button"
            disabled={isPending || !hasChanges}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            className="px-3 py-1 text-sm rounded bg-main-color text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
