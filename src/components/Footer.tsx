import React, { useEffect, useState } from "react";
import { getSiteConfig } from "../services/page.service";
import type { ISiteConfig } from "../types/page";
import SearchBar from "./custom-components/SearchBar";
import { NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";
import Loader from "./Loader";

const Footer: React.FC = () => {
  const [pageOverride, setPageOverride] = useState<boolean>(true);
  const [siteConfig, setSiteConfig] = useState<ISiteConfig | null>(null);
  const { menus, loading } = useStoreContext();

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const res = await getSiteConfig();
        const data: any = res.data[0];
        setSiteConfig(data);
        // setPageOverride(!!res.data?.[0]?.site_configs_override);
        setPageOverride(false);
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

  const footerMenus =
    menus?.filter(
      (item) =>
        item.main_menu_label_type === "text" &&
        item.main_menu_canonical &&
        item.main_menu_canonical !== "/"
    ) || [];

  // Split into two columns
  const midIndex = Math.ceil(footerMenus.length / 2);
  const firstColumn = footerMenus.slice(0, midIndex);
  const secondColumn = footerMenus.slice(midIndex);

  if (pageOverride) return <></>;
  if (loading) return <Loader />;
  return (
    <footer id="contact" className="container py-4 mt-5">
      <div className="text-center flex flex-column md:flex-row align-items-center justify-content-between gap-3 pb-4">
        <div className="flex align-items-center gap-2">
          {siteConfig?.site_configs_logo && (
            <img
              src={siteConfig?.site_configs_logo}
              alt="logo"
              className="h-3rem"
            />
          )}
        </div>
        <div className="flex justify-content-start xl:justify-content-between gap-7">
          {/* Column 1 */}
          <ul className="list-none m-0 p-0 gap-4 h-full">
            {firstColumn.map((item) => (
              <li key={item.main_menu_uuid} className="relative">
                <NavLink
                  to={item.main_menu_canonical}
                  className="uppercase border-round-md p-2 text-color active:bg-black-alpha-20 no-underline cursor-pointer flex align-items-center gap-1"
                >
                  {item.main_menu_label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Column 2 */}
          <ul className="list-none m-0 p-0 gap-4 h-full">
            {secondColumn.map((item) => (
              <li key={item.main_menu_uuid} className="relative">
                <NavLink
                  to={item.main_menu_canonical}
                  className="uppercase border-round-md p-2 text-color active:bg-black-alpha-20 no-underline cursor-pointer flex align-items-center gap-1"
                >
                  {item.main_menu_label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6 className="text-xl m-0">Join our community</h6>
          <div className="mt-3">
            <SearchBar placeholder="Enter your email" />
          </div>
        </div>
      </div>
      <div className="text-center border-top-1 border-black-alpha-20 flex flex-column md:flex-row align-items-center justify-content-between gap-3 pt-4">
        <div className="flex flex-column lg:flex-row align-items-center gap-5 lg:gap-2">
          {siteConfig?.site_configs_logo && (
            <img
              src={siteConfig?.site_configs_logo}
              alt=""
              className="h-2rem"
            />
          )}
          <div className="text-base ">
            © 2011-2025 © Wadex. All rights reserved.
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href="#"
            className="no-underline p-2 border-1 border-black-alpha-20 border-circle cursor-pointer flex align-items-center justify-content-center"
          >
            <i
              className="pi pi-facebook"
              style={{ fontSize: "1.25rem", color: "black" }}
            ></i>
          </a>
          <a
            href="#"
            className="no-underline p-2 border-1 border-black-alpha-20 border-circle cursor-pointer flex align-items-center justify-content-center"
          >
            <i
              className="pi pi-instagram"
              style={{ fontSize: "1.25rem", color: "black" }}
            ></i>
          </a>
          <a
            href="#"
            className="no-underline p-2 border-1 border-black-alpha-20 border-circle cursor-pointer flex align-items-center justify-content-center"
          >
            <i
              className="pi pi-linkedin"
              style={{ fontSize: "1.25rem", color: "black" }}
            ></i>
          </a>
          <a
            href="#"
            className="no-underline p-2 border-1 border-black-alpha-20 border-circle cursor-pointer flex align-items-center justify-content-center"
          >
            <i
              className="pi pi-instagram"
              style={{ fontSize: "1.25rem", color: "black" }}
            ></i>
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
