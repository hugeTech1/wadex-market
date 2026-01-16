import { useEffect, useState, useCallback } from "react";
import { getPageData, getPageDataByType, getSiteConfig } from "../services/page.service";
import type { IPageData } from "../types/page";
import { useStoreContext } from "../context/StoreContext";
import type { IMenuItem } from "../types/menu";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Loader from "../components/Loader";
import PageData from "../components/PageData";
import config from "../../public/config.json";
import { useAuth } from "../plugins/auth/context/AuthContext";

const DynamicPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { menus } = useStoreContext();
    const { user } = useAuth();

    const [pageData, setPageData] = useState<IPageData[]>([]);
    const [pageLoading, setPageLoading] = useState(false);

    /**
     * Extract UUID from slug using menus
     */
    const getUuidFromSlug = useCallback((slug: string | undefined, menus: IMenuItem[]) => {
        const target = "/" + (slug ?? "");

        for (const menu of menus) {
            if (menu.main_menu_canonical === target) return menu.main_menu_uuid;

            const sub = menu.sub_menu_items?.find(
                (item) => item.sub_menu_canonical === target
            );

            if (sub) return sub.sub_menu_uuid;
        }

        return undefined;
    }, []);

    /**
     * Fetch override type from site config
     */
    const getOverrideType = async (): Promise<string | undefined> => {
        try {
            const res = await getSiteConfig();
            return res.data?.[0]?.site_configs_override || "";
        } catch (err) {
            console.error("Failed to fetch site config:", err);
            return undefined;
        }
    };

    useEffect(() => {
        const fetchPage = async () => {
            setPageLoading(true);
            setPageData([]);

            try {
                // const overrideType = await getOverrideType();

                // // override logic: only apply if login enabled & user not logged in
                // if (config.enableLogin && !user && overrideType) {
                //     const res = await getPageDataByType(overrideType);
                //     setPageData(res.data);
                //     return;
                // }

                // Normal page resolution by slug/uuid
                const uuid = getUuidFromSlug(slug, menus);
               
                

                if (!uuid) {
                    setPageData([]);
                    return;
                }

                const res = await getPageData(uuid);
                setPageData(res.data);
            } catch (err) {
                console.error("Page fetch failed:", err);
            } finally {
                setPageLoading(false);
            }
        };

        fetchPage();
    }, [slug, menus, user, getUuidFromSlug]);

    return (
        <>
            {pageLoading && <Loader />}
            {pageData.length > 0 ? (
                <>
                    <PageData pageData={pageData} />
                </>
            ) : (
                <NotFound />
            )}
        </>
    );
};

export default DynamicPage;
