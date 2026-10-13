import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, More, Trash } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { deletePost } from "../DeletePost/DeletePost.services";

function DeleteButton({
  postId,
  canEdit,
  onEdit,
  onDetailsPage,
}: {
  postId: string;
  canEdit: boolean;
  onEdit: () => void;
  onDetailsPage?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    function closeOutside(e: MouseEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const { mutateAsync } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      if (onDetailsPage) {
        navigate("/posts");
        queryClient.removeQueries({ queryKey: ["postDetails", postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  async function runDelete() {
    try {
      await toast.promise(mutateAsync(), {
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
          className="absolute left-0 top-full mt-1 w-32 bg-white border rounded-lg shadow-lg z-20 overflow-hidden"
          onClick={stop}
        >
          {canEdit && (
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
        </div>
      )}
    </div>
  );
}

export default DeleteButton;