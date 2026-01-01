import React, { useEffect, useState } from 'react'
import { getSiteConfig } from '../services/page.service';
import type { ISiteConfig } from '../types/page';

const Footer: React.FC = () => {

  const [pageOverride, setPageOverride] = useState<boolean>(true);
  const [siteConfig, setSiteConfig] = useState<ISiteConfig | null>(null);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const res = await getSiteConfig();
        const data: any = res.data[0];
        setSiteConfig(data);
        setPageOverride(!!res.data?.[0]?.site_configs_override)
        if (data.site_configs_favicon) {
          let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
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
  if(pageOverride) return (<></>);
  return (
    <footer id="contact" className="container py-4">
      <div className="text-center flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-2">
          {siteConfig?.site_configs_logo && (
            <img src={siteConfig?.site_configs_logo} alt="logo" className='h-3rem' />
          )}

        </div>
        <div className="text-base " >
          {/* © 2011-{(new Date()).getFullYear()} {(siteConfig?.site_configs_title || '')}. All rights reserved. */}
        </div>
      </div>
    </footer>
  )
}
export default Footer
