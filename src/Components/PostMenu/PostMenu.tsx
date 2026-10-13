import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, More, Save2, Trash } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { deletePost } from "../DeletePost/DeletePost.services";
import { toggleBookmark } from "./Bookmark.services";

function PostMenu({
  postId,
  isOwner,
  canEdit,
  bookmarked,
  onEdit,
}: {
  postId: string;
  isOwner: boolean;
  canEdit: boolean;
  bookmarked: boolean;
  onEdit: () => void;
  onDetailsPage?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(bookmarked);
  const wrapper = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => setSaved(bookmarked), [bookmarked]);

  useEffect(() => {
    function closeOutside(e: MouseEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const { mutateAsync: removePost } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const { mutateAsync: toggleSave } = useMutation({
    mutationFn: () => toggleBookmark(postId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allPosts", "saved"] }),
  });

  async function handleSave() {
    setOpen(false);
    try {
      const res = await toast.promise(toggleSave(), {
        loading: "Saving...",
        success: (r) =>
          r.data.bookmarked ? "Post saved" : "Removed from saved",
        error: (err) => err.message,
      });
      setSaved(res.data.bookmarked);
    } catch {
      // error toast already shown
    }
  }

  async function runDelete() {
    try {
      await toast.promise(removePost(), {
        loading: "Deleting...",
        success: (res) => res.message,
        error: (err) => err.message,
      });
    } catch {
      // error toast already shown
    }
  }

  function confirmDelete() {
    setOpen(false);
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 font-medium">
            <Trash size="22" color="#ef4444" variant="Bold" />
            Delete this post?
          </span>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm rounded border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                runDelete();
              }}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  }

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  const itemClass =
    "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 cursor-pointer";

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-label="Post options"
        onClick={(e) => {
          stop(e);
          setOpen(!open);
        }}
        className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <More size="24" color="#2ccce4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 bg-white border rounded-lg shadow-lg z-20 overflow-hidden"
          onClick={stop}
        >
          <button
            type="button"
            className={itemClass}
            onClick={(e) => {
              stop(e);
              handleSave();
            }}
          >
            <Save2
              size="18"
              color="#2563eb"
              variant={saved ? "Bold" : "Outline"}
            />
            {saved ? "Remove from saved" : "Save post"}
          </button>

          {isOwner && canEdit && (
            <button
              type="button"
              className={itemClass}
              onClick={(e) => {
                stop(e);
                setOpen(false);
                onEdit();
              }}
            >
              <Edit2 size="18" color="#2ccce4" />
              Edit
            </button>
          )}

          {isOwner && (
            <button
              type="button"
              className={`${itemClass} text-red-500`}
              onClick={(e) => {
                stop(e);
                confirmDelete();
              }}
            >
              <Trash size="18" color="#ef4444" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PostMenu;
