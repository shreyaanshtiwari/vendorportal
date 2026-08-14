"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Wallet, 
  BarChart2, 
  Star, 
  Store, 
  Bell, 
  HelpCircle, 
  Settings,
  Menu,
  MoreHorizontal,
  ChevronLeft,
  Plus,
  User,
  Search
} from 'lucide-react';
import '../../styles/layout.css';

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const isHome = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/': 
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="SwadDesh Logo" width={160} height={52} style={{ objectFit: 'contain', margin: '-8px 0' }} priority />
          </div>
        );
      case '/products': return 'My Products';
      case '/orders': return 'All Orders';
      case '/earnings': return 'Earnings';
      case '/more': return 'More and Options';
      case '/profile': return 'Store Profile';
      default: 
        if (pathname === '/products/add') {
          return 'Add Product';
        }
        if (pathname === '/profile/edit') {
          return 'Edit Profile';
        }
        if (pathname === '/earnings/withdraw') {
          return 'Payouts';
        }
        if (pathname === '/notifications') {
          return 'Notifications';
        }
        if (pathname === '/analytics') {
          return 'Analytics';
        }
        if (pathname === '/support') {
          return 'Support';
        }
        if (pathname === '/earnings/history') {
          return 'Payment History';
        }
        if (pathname?.startsWith('/orders/')) {
          return 'Order Details';
        }
        return 'SwadDesh';
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('vendor_token');

    // No token at all → go to login
    if (!token) {
      if (pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
      return;
    }

    // Skip validation on auth pages
    if (pathname === '/login' || pathname === '/register') {
      setIsAuthenticated(true);
      return;
    }

    // Validate token with backend
    fetch('http://localhost:8080/api/vendor/validate-token', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem('vendor_token');
          localStorage.removeItem('vendor_profile');
          router.push('/login');
        }
      })
      .catch(() => {
        // Backend unreachable — allow access to avoid blocking on server down
        setIsAuthenticated(true);
      });
  }, [pathname, router]);

  // Don't render layout elements for auth pages
  if (isLoginPage || isRegisterPage) {
    return <>{children}</>;
  }

  // Prevent flash of content before auth check completes
  if (isAuthenticated === null && pathname !== '/login' && pathname !== '/register') {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--royal-cream)' }}>Loading...</div>;
  }

  return (
    <div className="vendor-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Mobile Header */}
      <header className="mobile-header">
        {!isHome && (
          <button className="menu-btn" onClick={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </button>
        )}
        <div className="mobile-header-brand left-aligned" style={isHome ? { margin: '0 0 0 -32px' } : {}}>
          {getPageTitle()}
        </div>
        <div className="mobile-header-actions">
          {pathname === '/products' ? (
            <Link href="/products/add" style={{ 
              background: 'transparent', 
              border: '1px solid var(--royal-gold)', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--royal-gold)',
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
              <Plus size={18} />
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Search color="white" size={24} />
              </Link>
              <Link href="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <User color="white" size={24} />
              </Link>
              <Link href="/notifications" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Bell color="white" size={24} />
                  {/* Notification Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    background: '#ff4444',
                    borderRadius: '50%',
                    border: '2px solid var(--royal-maroon)'
                  }} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Desktop & Mobile Sidebar */}
      <aside className={`vendor-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ justifyContent: 'center' }}>
          <Image src="/logo.png" alt="SwadDesh Logo" width={220} height={75} style={{ objectFit: 'contain', margin: '-12px 0' }} priority />
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/products" className={`nav-item ${pathname === '/products' ? 'active' : ''}`}>
            <Package size={20} />
            My Products
          </Link>
          <Link href="/orders" className={`nav-item ${pathname === '/orders' ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            Orders
          </Link>

          <Link href="/earnings" className={`nav-item ${pathname === '/earnings' ? 'active' : ''}`}>
            <Wallet size={20} />
            Payouts & Earnings
          </Link>
          <Link href="/analytics" className={`nav-item ${pathname === '/analytics' ? 'active' : ''}`}>
            <BarChart2 size={20} />
            Analytics
          </Link>
          <Link href="/reviews" className={`nav-item ${pathname === '/reviews' ? 'active' : ''}`}>
            <Star size={20} />
            Reviews
          </Link>
          <Link href="/profile" className={`nav-item ${pathname?.startsWith('/profile') ? 'active' : ''}`}>
            <Store size={20} />
            Store Profile
          </Link>
          <Link href="/notifications" className="nav-item">
            <Bell size={20} />
            Notifications
          </Link>

          <Link href="/more" className={`nav-item ${pathname === '/more' ? 'active' : ''}`}>
            <MoreHorizontal size={20} />
            More & Options
          </Link>

          <div className="sidebar-bottom">
            <div className="support-card">
              <p>Need Help?</p>
              <span>We're here to assist you</span>
              <button className="support-btn" onClick={() => router.push('/support')}>Contact Support</button>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem('vendor_token');
                localStorage.removeItem('vendor_profile');
                router.push('/login');
              }}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--royal-transition)'
              }}
            >
              <User size={18} /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className={`mobile-nav-item ${pathname === '/' || pathname === '/notifications' ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <LayoutDashboard size={22} strokeWidth={pathname === '/' || pathname === '/notifications' ? 2.5 : 2} />
            </div>
            Home
          </Link>
          <Link href="/products" onClick={() => setIsSidebarOpen(false)} className={`mobile-nav-item ${pathname?.startsWith('/products') ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <Package size={22} strokeWidth={pathname?.startsWith('/products') ? 2.5 : 2} />
            </div>
            Products
          </Link>
          <Link href="/orders" onClick={() => setIsSidebarOpen(false)} className={`mobile-nav-item ${pathname?.startsWith('/orders') ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <ShoppingCart size={22} strokeWidth={pathname?.startsWith('/orders') ? 2.5 : 2} />
            </div>
            Orders
          </Link>
          <Link href="/earnings" onClick={() => setIsSidebarOpen(false)} className={`mobile-nav-item ${pathname?.startsWith('/earnings') ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <Wallet size={22} strokeWidth={pathname?.startsWith('/earnings') ? 2.5 : 2} />
            </div>
            Earnings
          </Link>
          <Link href="/more" onClick={() => setIsSidebarOpen(false)} className={`mobile-nav-item ${pathname?.startsWith('/more') ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <MoreHorizontal size={22} strokeWidth={pathname?.startsWith('/more') ? 2.5 : 2} />
            </div>
            More
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default VendorLayout;
