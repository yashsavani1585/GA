import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, List, Package, MessageSquare, BookOpen, Coins, Gem, Settings } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition duration-200";
const linkIdle =
  "text-black/80 hover:bg-white/20 hover:text-black";
const linkActive =
  "bg-white/25 text-black ring-1 ring-white/30 shadow-sm";

const Sidebar = () => {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[18%] bg-[#CEBB98] text-black p-5 hidden md:flex flex-col justify-between"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Logo / Header */}
      <div>
        <div className="flex items-center justify-center mb-6">
          <Gem className="w-6 h-6 text-black mr-2" />
          <h2 className="text-2xl font-bold text-black">Admin Panel</h2>
        </div>

        <nav className="flex flex-col gap-2">
          {/* Dashboard */}
        

          {/* Add Jewellery */}
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Jewellery</span>
          </NavLink>

          {/* Manage Products */}
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <List className="w-4 h-4" />
            <span>Manage Products</span>
          </NavLink>

          {/* Manage Orders */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Package className="w-4 h-4" />
            <span>Manage Orders</span>
          </NavLink>

          {/* Custom Requests */}
          <NavLink
            to="/custom-requests"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span>Custom Requests</span>
          </NavLink>

          {/* Inquiries */}
          <NavLink
            to="/inquiries"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries</span>
          </NavLink>

          {/* Gold Prices */}
          <NavLink
            to="/gold-prices"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Coins className="w-4 h-4" />
            <span>Gold Prices</span>
          </NavLink>

          {/* Blog */}
          <NavLink
            to="/Blog/list"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog</span>
          </NavLink>

          {/* Auction */}
          <NavLink
            to="/admin/auctions"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Gem className="w-4 h-4" />
            <span>Auction</span>
          </NavLink>

          {/* Auction Ads */}
          <NavLink
            to="/admin/add"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>Auction Ads</span>
          </NavLink>
          <NavLink
            to="/admin/auction-orders"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Gem className="w-4 h-4" />
            <span>Auction Order list</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-white/30 pt-4">
       

        <p className="text-xs text-black/60 mt-4 text-center">
          © {new Date().getFullYear()} Jewel Admin
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
