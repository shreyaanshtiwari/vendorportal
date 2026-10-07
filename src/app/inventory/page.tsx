"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  X, 
  ShieldCheck,
  Package,
  Store
} from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import '../../styles/dashboard.css';
import { Skeleton } from '../../components/ui/Skeleton';

interface InventoryItem {
  id: string; // product id
  variant_id?: string;
  name: string;
  category?: string;
  region?: string;
  price: number;
  stock: number;
  approval_status: string;
  is_active: boolean;
  image?: string;
  image_url?: string;
  sku?: string;
  variant_name?: string;
}

function InventoryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterTab, setFilterTab] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadInventory = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');

    try {
      let list: InventoryItem[] = [];
      const vendorId = typeof window !== 'undefined' ? localStorage.getItem('swaddesh_vendor_id') : null;

      // 1. Direct Supabase query (Authoritative for product variants and real stock)
      if (vendorId) {
        const { data: prods, error: supaErr } = await supabase
          .from('products')
          .select('id, name, is_active, approval_status, image_url, category_id, region:regions(state_name, region_title), variants:product_variants(*)')
          .eq('vendor_id', vendorId)
          .order('created_at', { ascending: false });

        if (!supaErr && prods) {
          list = prods.map((p: any) => {
            const v = p.variants?.[0] || {};
            const stockQty = Number(v.stock_quantity ?? 0);
            return {
              id: p.id,
              variant_id: v.id,
              name: p.name,
              category: p.category_id,
              region: p.region?.state_name || p.region?.region_title || 'India',
              price: v.vendor_price || v.selling_price || 0,
              stock: isNaN(stockQty) ? 0 : stockQty,
              approval_status: p.approval_status || 'PENDING',
              is_active: p.is_active ?? true,
              image: p.image_url || '/placeholder-sweet.png',
              image_url: p.image_url || '/placeholder-sweet.png',
              sku: v.sku || `${p.name.toLowerCase().slice(0, 4)}-std`,
              variant_name: v.variant_name || 'Standard Pack',
            };
          });
        }
      }

      // 2. Fallback to backend API if Supabase list empty
      if (list.length === 0) {
        try {
          const apiData = await fetchApi('/vendor/catalog/products').catch(() => fetchApi('/vendor/products'));
          const rawItems = Array.isArray(apiData) ? apiData : (apiData?.products || []);
          if (rawItems.length > 0) {
            list = rawItems.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              region: p.region || 'India',
              price: p.vendor_price || p.price || 0,
              stock: Number(p.stock_quantity ?? p.stock ?? 0),
              approval_status: p.approval_status || 'PENDING',
              is_active: p.is_active ?? true,
              image: p.image || p.image_url || '/placeholder-sweet.png',
              image_url: p.image || p.image_url || '/placeholder-sweet.png',
              sku: p.sku || 'SKU-STD',
              variant_name: p.variant_name || 'Standard Pack',
            }));
          }
        } catch (apiErr) {
          console.warn('Backend catalog API call failed:', apiErr);
        }
      }

      setItems(list);
    } catch (err: any) {
      console.error('Failed to load inventory:', err);
      setError(err.message || 'Failed to load inventory items.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalProducts = items.length;
    const totalUnits = items.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const lowStockCount = items.filter(i => i.stock > 0 && i.stock <= 10).length;
    const outOfStockCount = items.filter(i => i.stock === 0).length;
    const inStockCount = items.filter(i => i.stock > 10).length;

    return { totalProducts, totalUnits, lowStockCount, outOfStockCount, inStockCount };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterTab === 'in_stock') return item.stock > 10;
      if (filterTab === 'low_stock') return item.stock > 0 && item.stock <= 10;
      if (filterTab === 'out_of_stock') return item.stock === 0;

      return true;
    });
  }, [items, searchQuery, filterTab]);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Header & Page Title */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>
              Inventory & Stock Status
            </h1>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              background: '#eff6ff', 
              color: '#2563eb', 
              padding: '3px 8px', 
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Live View
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>
            Monitor available stock quantities currently held and allocated by SwadDesh Admin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => loadInventory(true)}
            disabled={isRefreshing}
            style={{ 
              padding: '10px 14px', 
              background: 'white', 
              border: '1px solid var(--royal-border)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--royal-text-dark)'
            }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link href="/products" style={{ 
            padding: '10px 16px', 
            background: 'white', 
            border: '1.5px solid var(--royal-maroon)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: 'var(--royal-maroon)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '13px'
          }}>
            <Package size={15} /> View Catalog
          </Link>

          <Link href="/products/add" style={{ 
            padding: '10px 16px', 
            background: 'var(--royal-maroon)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(139, 29, 65, 0.2)'
          }}>
            <Plus size={16} /> List Product
          </Link>
        </div>
      </div>

      {/* Admin Allocation Notice */}
      <div style={{
        padding: '12px 16px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#92400e'
      }}>
        <ShieldCheck size={20} color="#d97706" style={{ flexShrink: 0 }} />
        <div>
          <strong>Admin Managed Inventory:</strong> Product stock quantities are managed and allocated directly through the <strong>SwadDesh Admin Portal</strong>. If you need stock re-allocations or batch updates, please coordinate with SwadDesh Admin.
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
        gap: '14px', 
        marginBottom: '24px' 
      }}>
        {/* Total Units */}
        <div className="royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(99, 102, 241, 0.12)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#4f46e5'
          }}>
            <Boxes size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Total Stock Units</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--royal-text-dark)' }}>
              {isLoading ? '...' : metrics.totalUnits}
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.12)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#059669'
          }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Healthy Stock (&gt;10)</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669' }}>
              {isLoading ? '...' : metrics.inStockCount}
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(245, 158, 11, 0.12)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#d97706'
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Low Stock (≤ 10)</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#d97706' }}>
              {isLoading ? '...' : metrics.lowStockCount}
            </div>
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div className="royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(239, 68, 68, 0.12)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#dc2626'
          }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Out of Stock (0)</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626' }}>
              {isLoading ? '...' : metrics.outOfStockCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search product name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 42px', 
                borderRadius: '12px', 
                border: '1px solid var(--royal-border)', 
                outline: 'none', 
                background: 'white', 
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: `All Products (${metrics.totalProducts})` },
            { id: 'in_stock', label: `In Stock (${metrics.inStockCount})` },
            { id: 'low_stock', label: `Low Stock (${metrics.lowStockCount})` },
            { id: 'out_of_stock', label: `Out of Stock (${metrics.outOfStockCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: filterTab === tab.id ? 'var(--royal-maroon)' : 'white',
                color: filterTab === tab.id ? 'white' : 'var(--royal-text-gray)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="royal-card" style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Skeleton width="70px" height="70px" borderRadius="12px" />
              <div style={{ flex: 1 }}>
                <Skeleton width="45%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="25%" height="12px" />
              </div>
              <Skeleton width="140px" height="38px" borderRadius="10px" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div style={{ padding: '16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'white', 
          borderRadius: '16px', 
          border: '1px solid var(--royal-border)' 
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📦</div>
          <h3 style={{ margin: '0 0 6px', color: 'var(--royal-text-dark)', fontWeight: 600 }}>
            {searchQuery ? 'No matching products found' : 'No inventory items listed'}
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--royal-text-gray)' }}>
            {searchQuery ? 'Try clearing your search query.' : 'First list a product in your catalog. Admin will then allocate stock for it.'}
          </p>
          {!searchQuery && (
            <Link href="/products/add" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--royal-maroon)',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '13px'
            }}>
              <Plus size={16} /> List First Product
            </Link>
          )}
        </div>
      )}

      {/* Inventory Items List (Read-Only) */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredItems.map(item => {
            const isOutOfStock = item.stock === 0;
            const isLowStock = item.stock > 0 && item.stock <= 10;
            const statusBg = isOutOfStock ? '#fee2e2' : isLowStock ? '#fef3c7' : '#dcfce7';
            const statusColor = isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#16a34a';
            const statusLabel = isOutOfStock ? 'Out of Stock (0)' : isLowStock ? `Low Stock (${item.stock})` : 'In Stock';

            return (
              <div 
                key={item.id} 
                className="royal-card" 
                style={{ 
                  padding: '18px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                  position: 'relative'
                }}
              >
                {/* Product info (Left) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 280px' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    background: 'var(--royal-cream)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {item.image || item.image_url ? (
                      <img 
                        src={item.image || item.image_url} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : '🥘'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>
                        {item.name}
                      </h4>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: statusBg, 
                        color: statusColor, 
                        padding: '2px 8px', 
                        borderRadius: '6px' 
                      }}>
                        {statusLabel}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: 'var(--royal-text-gray)' }}>
                      <span>SKU: {item.sku || 'STD'}</span>
                      <span>•</span>
                      <span>Your Cost: ₹{item.price}</span>
                      <span>•</span>
                      <span style={{ color: item.is_active ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                        {item.is_active ? 'Catalog Active' : 'Catalog Paused'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Units (Read-Only Display - Right) */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--royal-text-dark)' }}>
                      {item.stock} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>units</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Allocated by Admin
                    </div>
                  </div>

                  <div style={{ 
                    padding: '8px 14px', 
                    borderRadius: '10px', 
                    background: statusBg, 
                    color: statusColor, 
                    fontWeight: 700, 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {isOutOfStock ? <XCircle size={15} /> : isLowStock ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
                    {statusLabel}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 size={32} className="animate-spin" color="var(--royal-maroon)" />
      </div>
    }>
      <InventoryContent />
    </Suspense>
  );
}
