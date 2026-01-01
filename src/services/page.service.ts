import type { IHTTPResponse } from "../types/http-response";
import type { IEventModel, IPageData, ISiteConfig, IUpcomingEvent } from "../types/page";
import { fetchConfig } from "./config.service";
import httpClient from "./httpClient.service";

/* ------------------------------------------------------
   COMMON CONFIG / HELPERS
------------------------------------------------------ */

// Shared preprocess block
const preprocess = {
    process: "preStandard",
    params: {}
};

// Shared postprocess flatten block for page data
const pageFlattenPostprocess = {
    process: "postFlatten",
    params: {
        mainKeys: {
            label: "pages_label",
            canonical: "page_canonical",
            keywords: "page_keywords",
            css: "pages_css_cls"
        },
        subKeys: {
            segment: "block_segment",
            order: "block_order",
            element_id: "blocks_elementid",
            type: "blocks_type",
            shortcode: "blocks_shortcode",
            css: "blocks_css_cls",
            bgimage: "blocks_bgimage",
            bgcolor: "blocks_bgcolor"
        },
        subItemFieldName: "blocks"
    }
};

// Helper to create a datasource payload
const createPayload = async (
    params: Record<string, any>,
    query_id: string,
    postprocess: any
) => {
    const CONFIG = await fetchConfig();

    return {
        params,
        context: {
            query_id,
            application_id: CONFIG.APPLICATION_ID
        },
        control: {
            preprocess,
            postprocess
        }
    };
};

/* ------------------------------------------------------
   API FUNCTIONS
------------------------------------------------------ */

export const getPageDataByType = async (type: string) => {
    const payload = await createPayload(
        { pages_type: type },
        "f3b62590-d361-4448-a810-18eeae9bd497",
        [
            { process: "passForm", params: {} },
            pageFlattenPostprocess
        ]
    );

    return httpClient.post<IHTTPResponse<IPageData[]>>("/datasource", payload);
};

export const getPageData = async (uuid: string) => {
    const payload = await createPayload(
        { page_uuid: uuid },
        "193e92a2-7bec-42ca-a427-b67879f97718",
        [
            { process: "passForm", params: {} },
            pageFlattenPostprocess
        ]
    );

    return httpClient.post<IHTTPResponse<IPageData[]>>("/datasource", payload);
};

export const getQueryData = async (query_id: string) => {
    const payload = await createPayload(
        { carouselid: "home-slider" },
        query_id,
        {
            process: "postFlatten",
            params: {
                mainKeys: {
                    label: "carousels_label",
                    element: "carousels_elementid",
                    rotation: "carousels_rotation_time"
                },
                subKeys: {
                    overlay_text: "carousel_items_oltext",
                    image: "carousel_items_image",
                    uri: "carousel_items_uri",
                    internal: "carousel_items_internal",
                    button_text: "carousel_items_button_text"
                },
                subItemFieldName: "carousel_content"
            }
        }
    );

    return httpClient.post<IHTTPResponse<IPageData[]>>("/datasource", payload);
};

export const getSiteConfig = async () => {
    const payload = await createPayload(
        { config_type: "default" },
        "9d81dfb1-3a94-4b3d-a458-e98fdeb3f3c2",
        { process: "postStandard", params: {} }
    );

    return httpClient.post<IHTTPResponse<ISiteConfig[]>>("/datasource", payload);
};

export const runQuery = async (
    query_id: string,
    params: Record<string, any> = {},
    postprocess: any = { process: "postStandard", params: {} }
) => {
    const payload = await createPayload(
        params,
        query_id,
        postprocess
    );

    return httpClient.post<IHTTPResponse<any>>("/datasource", payload);
};

export const getEventsData = async (eventType: string = "misc") => {
    const payload = await createPayload(
        { events_type: eventType },
        "a53ae6fa-f9fb-442f-99de-c9c9db720dfd",
        {
            process: "postStandard",
            params: {}
        }
    );

    return httpClient.post<IHTTPResponse<IEventModel>>("/datasource", payload);
};

export const getUpcomingEventsData = async (query_id: string) => {
    const payload = await createPayload(
        { numblogs: "2" },
        query_id,
        {
            process: "postStandard",
            params: {}
        }
    );

    return httpClient.post<IHTTPResponse<IUpcomingEvent>>("/datasource", payload);
};

export const getNewsData = async (query_id: string) => {
    const payload = await createPayload(
        { numblogs: "100" },
        query_id,
        {
            process: "postStandard",
            params: {}
        }
    );

    return httpClient.post<IHTTPResponse<IUpcomingEvent>>("/datasource", payload);
};

