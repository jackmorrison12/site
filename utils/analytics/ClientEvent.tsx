'use client';

import { event } from 'nextjs-google-analytics';
import { ReactNode } from 'react';

export const ClientEvent = ({
  children,
  action,
  category,
  label,
}: {
  children: ReactNode;
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
