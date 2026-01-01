
export interface IPageBlock {
  block_segment: string;
  block_order: number;
  blocks_elementid: string;
  blocks_type: string;
  blocks_shortcode: string;
  blocks_css_cls: string;
  blocks_position: string;
  blocks_bgimage: string;
  blocks_bgcolor: string;
}

export interface IPageData {
  pages_label: string;
  page_canonical: string;
  page_keywords: string | null;
  pages_css_cls: string;
  blocks: IPageBlock[];
}

export interface ISiteConfig {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  site_configs_uuid: string;
  site_configs_title: string;
  site_configs_tagline: string;
  site_configs_keywords: string | null;
  site_configs_favicon: string | null;
  site_configs_company: string | null;
  site_configs_override: string | null;
  site_configs_logo: string | null;
}

export interface IEventModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  events_uuid: string;
  events_date_from: string;
  events_date_to: string;
  events_title: string;
  events_description: string;
  events_img: string;
  events_address: string;
  events_address_lat: string;
  events_address_lng: string;
  events_type: string;
  events_feature: boolean;
}

export interface IUpcomingEvent {
  blog_cat_name: string;
  blog_date: string;
  blog_excerpt: string | null;
  blog_status: string;
  blog_title: string;
  blogs_image: string;
  blogs_uuid: string;
  full_name: string | null;
}

export interface IMemberShips {
  memberships_description: string,
  memberships_price: string,
  memberships_price_label: string,
  memberships_title: string,
  memberships_uuid: string
}