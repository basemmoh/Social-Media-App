import { NavLink } from "react-router";
import { DocumentText, Global, Magicpen, Save2 } from "iconsax-reactjs";

const ITEMS = [
  { to: "/posts", label: "Feed", icon: DocumentText },
  { to: "/my-posts", label: "My Posts", icon: Magicpen },
  { to: "/community", label: "Community", icon: Global },
  { to: "/saved", label: "Saved", icon: Save2 },
];
function SideMenu({ grid = false }: { grid?: boolean }) {
  return (
    <nav
      className={`bg-white rounded-2xl shadow-md p-3 ${
        grid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-1"
      }`}
    >
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium ${
              grid ? "justify-center" : ""
            } ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : grid
                  ? "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Icon size="22" color="currentColor" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
export default SideMenu;
