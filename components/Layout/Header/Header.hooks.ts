import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const useHeader = () => {
  const pathname = usePathname();

  const [navViewable, setNavViewable] = useState(false);

  return {
    pathname,
    navViewable,
    setNavViewable,
  };
};
