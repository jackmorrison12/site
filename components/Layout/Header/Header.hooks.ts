import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MOBILE_NAV_AUTOCLOSE_DELAY_MS = 550;

export const useHeader = () => {
  const pathname = usePathname();

  const [navViewable, setNavViewable] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!navViewable) return;
    const timer = setTimeout(() => setNavViewable(false), MOBILE_NAV_AUTOCLOSE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return {
    pathname,
    navViewable,
    setNavViewable,
  };
};
