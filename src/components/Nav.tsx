import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";
import Loader from "./Loader";
import { getSiteConfig } from "../services/page.service";
import type { ISiteConfig } from "../types/page";

function NestedMenu({ menus }: any) {

  return (
    <div className="menu-container">
      <ul className="menu-root flex">
        {menus.map((item: any, i: any) => (
          <MenuItem key={i} item={item} level={0} />
        ))}
      </ul>
    </div>
  );
}

function MenuItem({ item, level }: any) {
  const hasChildren = item.sub_menu_items?.length > 0;

  return (
    <li className={`menu-item level-${level}`}>
      <NavLink
        to={item.main_menu_canonical || item.sub_menu_canonical}
        className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
      >
        {item.main_menu_label || item.sub_menu_label}
        {hasChildren && <i className="pi pi-angle-right ml-2"></i>}
      </NavLink>

      {hasChildren && (
        <ul className="submenu">
          {item.sub_menu_items.map((child: any, i: any) => (
            <MenuItem key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function MobileSideMenu({ menus }: any) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <i className="pi pi-bars"></i>
      </button>

      {/* Overlay */}
      <div
        className={`overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Side Drawer */}
      <div className={`side-menu ${mobileOpen ? "open" : ""}`}>
        <div className="side-header">
          <h3></h3>
          <button onClick={() => setMobileOpen(false)}>
            <i className="pi pi-times"></i>
          </button>
        </div>

        <ul className="side-root">
          {menus.map((item: any, i: number) => (
            <MobileMenuItem key={i} item={item} level={0} />
          ))}
        </ul>
      </div>
    </>
  );
}

function MobileMenuItem({ item, level }: any) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.sub_menu_items?.length > 0;

  return (
    <li className={`side-item level-${level}`}>
      <div
        className="side-link"
        onClick={() => (hasChildren ? setOpen(!open) : null)}
      >
        <NavLink
          to={item.main_menu_canonical || item.sub_menu_canonical}
          onClick={(e) => hasChildren && e.preventDefault()}
        >
          {item.main_menu_label || item.sub_menu_label}
        </NavLink>

        {hasChildren && (
          <i
            className="pi pi-angle-right"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          ></i>
        )}
      </div>

      {hasChildren && (
        <ul className={`mobile-submenu ${open ? "open" : ""}`}>
          {item.sub_menu_items.map((sub: any, i: number) => (
            <MobileMenuItem key={i} item={sub} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<ISiteConfig | null>(null);
  const [pageOverride, setPageOverride] = useState<boolean>(true);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { menus, loading } = useStoreContext();
    console.log("Menus:", menus);

  const menuRef = useRef<HTMLUListElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);

  // Close mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const res = await getSiteConfig();
        const data = res.data[0];

        if (!data?.site_configs_title) data.site_configs_title = "Master WB2";
        if (!data?.site_configs_tagline)
          data.site_configs_tagline = "Your Tagline Here";

        setPageOverride(false);
        // setPageOverride(!!data.site_configs_override);
        setSiteConfig(data);

        document.title = `${data.site_configs_title} | ${data.site_configs_tagline}`;

        // Favicon
        if (data.site_configs_favicon) {
          let link =
            document.querySelector<HTMLLinkElement>("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.site_configs_favicon;
        }
      } catch (err) {
        console.error("Failed to load site config:", err);
      }
    };

    fetchSiteConfig();
  }, []);

  if (loading) return <Loader />;
  if (pageOverride) return null;

  return (
    <>
      <nav className={isSticky ? "main-menu sticky" : "main-menu"}>
        <div className="container flex justify-content-between">
          <div className="relative">
            <NavLink to={"/"} className="logo">
              {siteConfig?.site_configs_logo && (
                <img src={siteConfig.site_configs_logo} alt="Logo" />
              )}
            </NavLink>
          </div>
          <NestedMenu menus={menus} />
          <MobileSideMenu menus={menus} />
        </div>
      </nav>
    </>
  );
};

export default Nav;
