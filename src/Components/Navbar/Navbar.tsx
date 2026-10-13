import { Avatar } from "@heroui/react";
import { Ghost, Home2, User, Notification } from "iconsax-reactjs";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AppButton from "../../SharedComponent/AppButton/AppButton";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useUnreadCount } from "../../Hooks/useUnreadCount/useUnreadCount";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();
  const { data: unread = 0 } = useUnreadCount();
  const { userData, setUserData } = useContext(userAuthContext);

  function setAvatar() {
    setIsOpen(!isOpen);
  }
  function handleLogOut() {
    localStorage.removeItem("user_tkn");
    setUserData(null);
    router("/login");
    setIsOpen(false);
  }

  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeAll(e: MouseEvent) {
      const target = e.target as Node;
      if (avatarBtnRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <nav className="bg-white fixed w-full z-20 top-0 inset-s-0 border-b border-default shadow-2xl">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Ghost size="50" color="#2ccce4" variant="Outline" />
          </Link>

          {/* Page links */}
          {userData && (
            <ul className="flex gap-1 p-1.5 border rounded-full bg-white">
              <li>
                <NavLink to="/posts" className={navLinkClass}>
                  <Home2 size="20" color="currentColor" />
                  <span className="hidden sm:inline">Feed</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={navLinkClass}>
                  <User size="20" color="currentColor" />
                  <span className="hidden sm:inline">Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/notifications" className={navLinkClass}>
                  <span className="relative">
                    <Notification size="20" color="currentColor" />
                    {unread > 0 && (
                      <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:inline">Notifications</span>
                </NavLink>
              </li>
            </ul>
          )}

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {userData ? (
              <button
                onClick={setAvatar}
                ref={avatarBtnRef}
                type="button"
                className="flex p-1 items-center gap-2 cursor-pointer text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span className="sr-only">Open user menu</span>
                <Avatar>
                  <Avatar.Image alt={userData.username} src={userData.photo} />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar>
                <p className="font-bold hidden md:block">{userData.name}</p>
              </button>
            ) : (
              <div>
                <Link to="/login">
                  <AppButton className="bg-main-color hover:bg-main-color/80 pointer-events-none">
                    Login
                  </AppButton>
                </Link>
                <Link to="/register">
                  <AppButton className="bg-main-color hover:bg-main-color/80 pointer-events-none">
                    Register
                  </AppButton>
                </Link>
              </div>
            )}

            {/* Dropdown menu */}
            <div
              className={`${isOpen ? "block" : "hidden"} z-50 absolute inset-e-0 top-full bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44`}
              id="user-dropdown"
            >
              <ul
                className="p-2 text-sm text-body font-medium"
                aria-labelledby="user-menu-button"
              >
                <li>
                  <Link
                    to="/profile"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Settings
                  </Link>
                </li>

                <li>
                  <span
                    onClick={(_) => handleLogOut()}
                    className="cursor-pointer inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-red-500"
                  >
                    Sign out
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
