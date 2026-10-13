import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import PostsCard from "../../Components/PostsCard/PostsCard";
import Loading from "../../Components/Loading/Loading";
import ImageLightbox from "../../Components/ImageLightbox/ImageLightbox";
import { followUser } from "../../Components/SuggestedFriends/Suggested.services";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { getUserData } from "../../Context/UserAuthProvider/UserAuthProvider.services";
import { useInfinitePostList } from "../../Hooks/useInfinitePostList/useInfinitePostList";
import { fetchUserPosts } from "../Posts/PostLists.services";
import { getUserProfile } from "./UserProfile.services";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border rounded-2xl p-4 text-center bg-white">
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { userData, setUserData } = useContext(userAuthContext);
  const queryClient = useQueryClient();

  const [viewing, setViewing] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [followState, setFollowState] = useState<{
    following: boolean;
    followersCount: number;
  } | null>(null);

  useEffect(() => setFollowState(null), [id]);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id!),
    enabled: !!id,
  });
  useDocumentTitle(user ? `${user.name}'s Profile` : "Profile");
  const feed = useInfinitePostList(
    ["allPosts", "user", id],
    (page) => fetchUserPosts(id!, page),
    !!id,
  );

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (
      inView &&
      feed.hasNextPage &&
      !feed.isFetchingNextPage &&
      !feed.isFetchNextPageError
    ) {
      feed.fetchNextPage();
    }
  }, [
    inView,
    feed.hasNextPage,
    feed.isFetchingNextPage,
    feed.isFetchNextPageError,
    feed.fetchNextPage,
  ]);

  if (userData && id === userData._id)
    return <Navigate to="/profile" replace />;

  if (isLoading) return <Loading />;
  if (isError || !user) {
    return <p className="text-center text-gray-500 py-20">User not found.</p>;
  }

  const following =
    followState?.following ??
    user.isFollowing ??
    !!userData?.following?.includes(user._id);
  const followersCount =
    followState?.followersCount ?? user.followersCount ?? 0;

  async function handleFollow() {
    if (!user) return;
    setPending(true);
    try {
      const res = await toast.promise(followUser(user._id), {
        loading: "Working...",
        success: (r) =>
          r.data.following
            ? `You followed ${user.name}`
            : `You unfollowed ${user.name}`,
        error: (e) => e.message,
      });
      setFollowState({
        following: res.data.following,
        followersCount: res.data.followersCount,
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); 
      getUserData().then((d) => d && setUserData(d)); 
    } catch {
      // error toast already shown
    } finally {
      setPending(false);
    }
  }

  const all = feed.data?.pages.flatMap((p) => p.posts) ?? [];
  const posts = [
    ...new Map(all.map((p) => [p._id, p] as const)).values(),
  ].filter((p) => p.body || p.image || p.sharedPost);
  const postsTotal = feed.data?.pages[0]?.total;

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="w-full max-w-6xl px-3 pb-10 flex flex-col gap-6">
      <section className="bg-white rounded-3xl shadow-md overflow-hidden">
        {user.cover ? (
          <img
            src={user.cover}
            alt=""
            onClick={() => setViewing(user.cover!)}
            className="h-48 sm:h-64 w-full object-cover cursor-zoom-in"
          />
        ) : (
          <div className="h-48 sm:h-64 w-full bg-linear-to-r from-blue-200 to-cyan-100" />
        )}

        <div className="relative -mt-16 mx-3 sm:mx-8 mb-6 bg-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={user.photo}
                alt={user.name}
                onClick={() => setViewing(user.photo)}
                className="size-24 sm:size-28 rounded-full object-cover ring-4 ring-white shadow cursor-zoom-in"
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-bold truncate">{user.name}</h1>
                <p className="text-gray-500 text-lg truncate">
                  @{user.username}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {joined && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                      Joined {joined}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={handleFollow}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer disabled:opacity-50 ${
                      following
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-104">
              <StatBox label="Followers" value={followersCount} />
              <StatBox label="Following" value={user.followingCount ?? 0} />
              <StatBox label="Posts" value={postsTotal ?? "–"} />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
        {feed.isLoading && <Loading />}

        {!feed.isLoading && posts.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            {user.name} hasn't posted anything yet.
          </p>
        )}

        {posts.map((p) => (
          <PostsCard key={p._id} post={p} />
        ))}

        <div ref={ref} />

        {feed.isFetchingNextPage && (
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
            <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            Loading more posts...
          </p>
        )}

        {feed.isFetchNextPageError && (
          <button
            type="button"
            onClick={() => feed.fetchNextPage()}
            className="mx-auto px-4 py-2 rounded border cursor-pointer"
          >
            Couldn't load more. Try again
          </button>
        )}
      </div>

      {viewing && (
        <ImageLightbox src={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

export default UserProfile;
