import { useContext, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PostsCard from "../../Components/PostsCard/PostsCard";
import Loading from "../../Components/Loading/Loading";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { getUserData } from "../../Context/UserAuthProvider/UserAuthProvider.services";
import { useInfinitePostList } from "../../Hooks/useInfinitePostList/useInfinitePostList";
import { fetchBookmarks, fetchUserPosts } from "../Posts/PostLists.services";
import toast from "react-hot-toast";
import ImageLightbox from "../../Components/ImageLightbox/ImageLightbox";
import { CameraIcon, ExpandIcon } from "./ProfileIcons";
import { uploadCover, uploadPhoto } from "./Profile.services";
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
const reveal =
  "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";
const coverBtn =
  "flex items-center gap-1.5 rounded-lg bg-black/60 hover:bg-black/75 px-3 py-1.5 text-sm font-semibold text-white cursor-pointer";
const roundBtn =
  "grid place-items-center size-8 rounded-full bg-white/90 hover:bg-white text-gray-800 cursor-pointer";
function Profile() {
  const { userData, setUserData } = useContext(userAuthContext);
  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  async function runUpdate(action: () => Promise<string>, loading: string) {
    try {
      await toast.promise(
        action().then(async (message) => {
          const fresh = await getUserData(); 
          if (fresh) setUserData(fresh);
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["allPosts"] }); 
          return message;
        }),
        { loading, success: (m) => m, error: (e) => e.message },
      );
    } catch {
      // error toast already shown
    }
  }

  function handlePick(
    e: React.ChangeEvent<HTMLInputElement>,
    action: (file: File) => Promise<string>,
    loading: string,
  ) {
    const file = e.target.files?.[0];
    e.target.value = ""; 
    if (file) runUpdate(() => action(file), loading);
  }

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserData,
    placeholderData: userData ?? undefined,
  });
  const user = profile ?? userData;
  useDocumentTitle(user ? `${user.name}'s Profile` : "Profile");
  const userId = user?._id;

  const mine = useInfinitePostList(
    ["allPosts", "mine", userId],
    (page) => fetchUserPosts(userId!, page),
    !!userId,
  );
  const saved = useInfinitePostList(["allPosts", "saved"], fetchBookmarks);
  const active = tab === "posts" ? mine : saved;

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    if (
      inView &&
      active.hasNextPage &&
      !active.isFetchingNextPage &&
      !active.isFetchNextPageError
    ) {
      active.fetchNextPage();
    }
  }, [
    inView,
    active.hasNextPage,
    active.isFetchingNextPage,
    active.isFetchNextPageError,
    active.fetchNextPage,
  ]);

  if (!user) return <Loading />;

  const all = active.data?.pages.flatMap((p) => p.posts) ?? [];
  const posts = [
    ...new Map(all.map((p) => [p._id, p] as const)).values(),
  ].filter((p) => p.body || p.image || p.sharedPost);

  const myCount = mine.data?.pages[0]?.total;
  const savedCount = saved.data?.pages[0]?.total;
  const activeCount = tab === "posts" ? myCount : savedCount;

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  const tabClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
      isActive ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
    }`;

  return (
    <div className="w-full max-w-6xl px-3 pb-10 flex flex-col gap-6">
      {/* Cover + profile card */}
      <section className="bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="relative group h-48 sm:h-64 w-full">
          {user.cover ? (
            <img
              src={user.cover}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-r from-blue-200 to-cyan-100" />
          )}

          <div
            className={`absolute top-3 right-3 flex flex-wrap justify-end gap-2 transition-opacity ${reveal}`}
          >
            {user.cover && (
              <button
                type="button"
                className={coverBtn}
                onClick={() => setViewing(user.cover)}
              >
                <ExpandIcon /> View cover
              </button>
            )}
            <button
              type="button"
              className={coverBtn}
              onClick={() => coverInput.current?.click()}
            >
              <CameraIcon /> Change cover
            </button>
          </div>

          <input
            ref={coverInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handlePick(e, uploadCover, "Updating cover...")}
          />
        </div>

        <div className="relative -mt-16 mx-3 sm:mx-8 mb-6 bg-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0 size-24 sm:size-28 rounded-full ring-4 ring-white shadow">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="size-full rounded-full object-cover"
                />

                <div
                  className={`absolute inset-0 rounded-full bg-black/45 flex items-center justify-center gap-2 transition-opacity ${reveal}`}
                >
                  <button
                    type="button"
                    aria-label="View photo"
                    className={roundBtn}
                    onClick={() => setViewing(user.photo)}
                  >
                    <ExpandIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Change photo"
                    className={roundBtn}
                    onClick={() => photoInput.current?.click()}
                  >
                    <CameraIcon />
                  </button>
                </div>

                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handlePick(e, uploadPhoto, "Updating photo...")
                  }
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold truncate">{user.name}</h1>
                <p className="text-gray-500 text-lg truncate">
                  @{user.username}
                </p>
                {joined && (
                  <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                    Joined {joined}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-104">
              <StatBox label="Followers" value={user.followersCount ?? 0} />
              <StatBox label="Following" value={user.followingCount ?? 0} />
              <StatBox label="Bookmarks" value={user.bookmarksCount ?? 0} />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_20rem] gap-4">
            <div className="border rounded-2xl p-5 bg-gray-50/60">
              <h2 className="font-bold mb-3">About</h2>
              <ul className="flex flex-col gap-2 text-gray-600 text-sm">
                <li>Email: {user.email}</li>
                {user.dateOfBirth && (
                  <li>
                    Born:{" "}
                    {new Date(user.dateOfBirth).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </li>
                )}
                {user.gender && (
                  <li className="capitalize">Gender: {user.gender}</li>
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <div className="border rounded-2xl p-4 bg-gray-50/60">
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  My posts
                </p>
                <p className="text-2xl font-bold mt-1">{myCount ?? "–"}</p>
              </div>
              <div className="border rounded-2xl p-4 bg-gray-50/60">
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Saved posts
                </p>
                <p className="text-2xl font-bold mt-1">{savedCount ?? "–"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-3 flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            className={tabClass(tab === "posts")}
            onClick={() => setTab("posts")}
          >
            My Posts
          </button>
          <button
            type="button"
            className={tabClass(tab === "saved")}
            onClick={() => setTab("saved")}
          >
            Saved
          </button>
        </div>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1">
          {activeCount ?? "–"}
        </span>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-5">
        {active.isLoading && <Loading />}

        {!active.isLoading && posts.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            {tab === "posts"
              ? "You haven't posted anything yet."
              : "No saved posts yet."}
          </p>
        )}

        {posts.map((p) => (
          <PostsCard key={p._id} post={p} />
        ))}

        <div ref={ref} />

        {active.isFetchingNextPage && (
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
            <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            Loading more posts...
          </p>
        )}

        {active.isFetchNextPageError && (
          <button
            type="button"
            onClick={() => active.fetchNextPage()}
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

export default Profile;
