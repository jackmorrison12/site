'use client';

import { event } from 'nextjs-google-analytics';

export const ClientEvent = ({
  children,
  action,
  category,
  label,
}: {
  children: React.ReactNode;
  action: string;
  category: string;
  label: string;
}) => (
  <span
    onClick={() =>
      event(action, {
        category,
        label,
      })
    }
  >
    {children}
  </span>
);
