import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send2 } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { sharePost } from "./Share.services";

function ShareButton({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const wrapper = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    function closeOutside(e: MouseEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => sharePost(postId, caption),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
  });

  async function handleShare() {
    try {
      await toast.promise(mutateAsync(), {
        loading: "Sharing...",
        success: (res) => {
          setCaption("");
          setOpen(false);
          return res.message;
        },
        error: (err) => err.message,
      });
    } catch {
      // error toast already shown
    }
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-label="Share"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-600 w-full"
      >
        <Send2 size="22" color="currentColor" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-72 bg-white border rounded-lg shadow-lg p-3 z-10 flex flex-col gap-2">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something about this..."
            className="border rounded px-2 py-1.5 text-sm"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleShare}
              className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
