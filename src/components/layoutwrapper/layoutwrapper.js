// layoutwrapper.jsx
'use client';

import { usePathname } from 'next/navigation';
import Footer from '../footer/footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <div className="layout-wrapper">
      <main>{children}</main>
      {!isLandingPage && (
        <div className="footer-desktop-only">
          <Footer />
        </div>
      )}
    </div>
  );
}
