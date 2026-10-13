import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Avatar } from "@heroui/react";
import { Heart, MessageText1, Send2, UserAdd } from "iconsax-reactjs";
import toast from "react-hot-toast";
import Loading from "../../Components/Loading/Loading";
import { timeAgo } from "../../utils/timeAgo";
import { useUnreadCount } from "../../Hooks/useUnreadCount/useUnreadCount";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "./Notifications.services";
import type {
  NotificationItem,
  NotificationsResponseType,
} from "./Notifications.interface";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

type ListData = InfiniteData<NotificationsResponseType>;

const TYPE_META: Record<
  string,
  { text: string; icon: typeof Heart; color: string }
> = {
  comment_post: { text: "commented on your post", icon: MessageText1, color: "#2563eb" },
  like_post: { text: "liked your post", icon: Heart, color: "#ef4444" },
  follow_user: { text: "followed you", icon: UserAdd, color: "#7c3aed" },
  share_post: { text: "shared your post", icon: Send2, color: "#0891b2" },
};
const DEFAULT_META = { text: "sent you a notification", icon: MessageText1, color: "#6b7280" };

// mark one notification (or all, when no id is given) as read inside the cached lists
function flipRead(old: ListData | undefined, id?: string): ListData | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        notifications: page.data.notifications.map((n) =>
          !id || n._id === id ? { ...n, isRead: true } : n,
        ),
      },
    })),
  };
}

function Notifications() {
  useDocumentTitle("Notifications");

  const [tab, setTab] = useState<"all" | "unread">("all");
  const unreadOnly = tab === "unread";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useUnreadCount();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteQuery({
      queryKey: ["notifications", "list", unreadOnly],
      queryFn: ({ pageParam }) => getNotifications(unreadOnly, pageParam),
      initialPageParam: 1,
      getNextPageParam: (last) => {
        const { currentPage, numberOfPages } = last.meta.pagination;
        return currentPage < numberOfPages ? currentPage + 1 : undefined;
      },
    });

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const all = data?.pages.flatMap((p) => p.data.notifications) ?? [];
  const items = [...new Map(all.map((n) => [n._id, n] as const)).values()];

  const readOne = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_res, id) => {
      // keep the card visible but mark it read, and refresh the badge
      queryClient.setQueriesData<ListData>(
        { queryKey: ["notifications", "list"] },
        (old) => flipRead(old, id),
      );
      queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
  });

  const readAll = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  async function handleMarkAll() {
    try {
      await toast.promise(readAll.mutateAsync(), {
        loading: "Marking as read...",
        success: "All notifications marked as read",
        error: "Couldn't mark them as read",
      });
    } catch {
      // error toast already shown
    }
  }

  function handleOpen(n: NotificationItem) {
    if (!n.isRead) readOne.mutate(n._id);
    if (n.entityType === "post") navigate(`/postDetails/${n.entityId}`);
  }

  const tabClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-full max-w-6xl px-3 pb-10">
      <section className="bg-white rounded-2xl shadow-md overflow-hidden">
        <header className="p-5 sm:p-6 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
              <p className="text-sm text-gray-500 mt-1">
                Updates for likes, comments, shares, and follows.
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={unreadCount === 0 || readAll.isPending}
              className="shrink-0 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✓ Mark all as read
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="button" className={tabClass(tab === "all")} onClick={() => setTab("all")}>
              All
            </button>
            <button type="button" className={tabClass(tab === "unread")} onClick={() => setTab("unread")}>
              Unread
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 text-white text-xs px-1.5">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 flex flex-col gap-3">
          {isLoading && <Loading />}

          {!isLoading && items.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              {unreadOnly ? "You're all caught up." : "No notifications yet."}
            </p>
          )}

          {items.map((n) => {
            const meta = TYPE_META[n.type] ?? DEFAULT_META;
            const Icon = meta.icon;
            const preview =
              n.entity?.body ?? n.entity?.name ?? (n.entity?.image ? "Photo" : "");

            return (
              <button
                key={n._id}
                type="button"
                onClick={() => handleOpen(n)}
                className={`w-full text-left flex items-start gap-3 rounded-2xl border p-4 cursor-pointer ${
                  n.isRead
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                }`}
              >
                <Avatar>
                  <Avatar.Image alt={n.actor.name} src={n.actor.photo} />
                  <Avatar.Fallback>
                    {n.actor.name.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{n.actor.name}</span>{" "}
                    {meta.text}
                  </p>
                  {preview && (
                    <p className="text-sm text-gray-600 truncate mt-0.5">{preview}</p>
                  )}
                  <p className="flex items-center gap-2 text-xs mt-2">
                    <Icon size="16" color={meta.color} />
                    {n.isRead ? (
                      <span className="text-green-600">✓ Read</span>
                    ) : (
                      <span className="font-semibold text-blue-600">New</span>
                    )}
                  </p>
                </div>

                <span className="text-xs text-gray-500 shrink-0">
                  {timeAgo(n.createdAt)}
                </span>
              </button>
            );
          })}

          <div ref={ref} />

          {isFetchingNextPage && (
            <p className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
              <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              Loading more notifications...
            </p>
          )}

          {isFetchNextPageError && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              className="mx-auto px-4 py-2 rounded border cursor-pointer"
            >
              Couldn't load more. Try again
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Notifications;