import React, { ReactNode } from 'react';

import Header from './Header';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Jack Morrison' }: Props) => (
  <div>
    <Header title={title} />
    {children}
    <Footer />
  </div>
);

export default Layout;
