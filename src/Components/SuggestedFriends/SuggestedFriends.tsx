import { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Avatar } from "@heroui/react";
import { People, SearchNormal1, UserAdd } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { followUser, getSuggestions } from "./Suggested.services";
import type { SuggestedUser } from "./Suggested.interface";

const MAX_VISIBLE = 5;
const REFILL_BELOW = 8; // keep a buffer of people when not searching
const MAX_SEARCH_PAGES = 1000; // 1000 pages x 50 = up to 50000 people checked

function SuggestedFriends({ collapsible = false }: { collapsible?: boolean }) {
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const showBody = !collapsible || expanded;
  const queryClient = useQueryClient();

  // who you followed: kept in the query cache so it survives leaving the page
  const [followed, setFollowed] = useState<Record<string, boolean>>(
    () =>
      queryClient.getQueryData<Record<string, boolean>>(["followedIds"]) ?? {},
  );

  useEffect(() => {
    queryClient.setQueryData(["followedIds"], followed);
  }, [followed, queryClient]);

  // wait until typing pauses before searching
  useEffect(() => {
    const t = setTimeout(() => setTerm(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["suggestions"],
      queryFn: ({ pageParam }) => getSuggestions(pageParam),
      initialPageParam: 1,
      getNextPageParam: (last) => {
        const { currentPage, numberOfPages } = last.meta.pagination;
        return currentPage < numberOfPages ? currentPage + 1 : undefined;
      },
      staleTime: 5 * 60 * 1000,
    });

  // everyone loaded so far, without duplicates
  const all = data?.pages.flatMap((p) => p.data.suggestions) ?? [];
  const pool = [...new Map(all.map((u) => [u._id, u] as const)).values()];

  // people you haven't followed yet: these fill the normal list
  const available = pool.filter((u) => !followed[u._id]);

  const matches = term
    ? pool.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term),
      )
    : available;
  const visible = matches.slice(0, MAX_VISIBLE);

  const pagesLoaded = data?.pages.length ?? 0;
  const searchCapReached = pagesLoaded >= MAX_SEARCH_PAGES;
  const canLoadMore = !!hasNextPage && !isFetchingNextPage;
  const searchingMore =
    !!term &&
    visible.length < MAX_VISIBLE &&
    !!hasNextPage &&
    !searchCapReached;

  // one effect loads more pages whenever the panel needs more people
  useEffect(() => {
    if (!canLoadMore) return;
    if (!term && available.length < REFILL_BELOW) {
      fetchNextPage();
    } else if (term && visible.length < MAX_VISIBLE && !searchCapReached) {
      fetchNextPage();
    }
  }, [
    canLoadMore,
    term,
    available.length,
    visible.length,
    searchCapReached,
    fetchNextPage,
  ]);

  const { mutateAsync } = useMutation({ mutationFn: followUser });

  async function handleFollow(user: SuggestedUser) {
    setPendingId(user._id);
    try {
      const res = await toast.promise(mutateAsync(user._id), {
        loading: "Working...",
        success: (r) =>
          r.data.following
            ? `You followed ${user.name}`
            : `You unfollowed ${user.name}`,
        error: (err) => err.message,
      });
      setFollowed((m) => ({ ...m, [user._id]: res.data.following }));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch {
      // error toast already shown
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg">
          <People size="22" color="#2563eb" />
          Suggested Friends
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
            {visible.length}
          </span>
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-semibold text-blue-600 cursor-pointer"
            >
              {expanded ? "Hide" : "Show"}
            </button>
          )}
        </div>
      </header>

      {showBody && (
        <>
          <label className="flex items-center gap-2 border rounded-full px-3 py-2 bg-gray-50">
            <SearchNormal1 size="18" color="#6b7280" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </label>

          {(isLoading || searchingMore) && (
            <p className="text-sm text-gray-500">
              {term ? "Searching..." : "Loading..."}
            </p>
          )}

          {!isLoading && !searchingMore && visible.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              {term
                ? `No match among the ${pool.length} people checked.`
                : "No more suggestions."}
            </p>
          )}

          <ul className="flex flex-col gap-3">
            {visible.map((user) => (
              <li
                key={user._id}
                className="border rounded-xl p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <Avatar.Image alt={user.name} src={user.photo} />
                    <Avatar.Fallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={pendingId === user._id}
                    onClick={() => handleFollow(user)}
                    className={`flex items-center gap-1 rounded-full text-sm font-medium px-3 py-1.5 cursor-pointer disabled:opacity-50 ${
                      followed[user._id]
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <UserAdd size="16" color="currentColor" />
                    {followed[user._id] ? "Following" : "Follow"}
                  </button>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                    {user.followersCount} followers
                  </span>
                  {user.mutualFollowersCount > 0 && (
                    <span className="bg-blue-50 text-blue-600 rounded-full px-2 py-0.5">
                      {user.mutualFollowersCount} mutual
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default SuggestedFriends;
