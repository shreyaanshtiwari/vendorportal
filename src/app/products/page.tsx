"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Plus, Loader2, Edit3, Trash2, Pause, Play, X, CheckCircle, AlertCircle, Boxes } from 'lucide-react';
import Image from 'next/image';
import { fetchApi } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import '../../styles/dashboard.css';

import { Skeleton } from '../../components/ui/Skeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown & Action states
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Quick Edit Modal state (Listing & Price only - Stock is managed in Inventory)
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Feedback Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const loadProducts = async () => {
    try {
      let list: any[] = [];
      try {
        const data = await fetchApi('/vendor/catalog/products').catch(() => fetchApi('/vendor/products'));
        list = Array.isArray(data) ? data : (data?.products || []);
      } catch (backendErr) {
        console.warn('Backend unavailable, querying Supabase directly:', backendErr);
      }

      // Resilient fallback to Supabase if list is empty or backend failed
      if (!list || list.length === 0) {
        const vId = typeof window !== 'undefined' ? localStorage.getItem('swaddesh_vendor_id') : null;
        if (vId) {
          const { data: supaProds } = await supabase
            .from('products')
            .select('*, variants:product_variants(*), region:regions(*)')
            .eq('vendor_id', vId)
            .order('created_at', { ascending: false });

          if (supaProds && supaProds.length > 0) {
            list = supaProds.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category_id,
              region: p.region?.state_name || p.region?.region_title || 'India',
              price: p.variants?.[0]?.vendor_price || p.variants?.[0]?.selling_price || 0,
              stock: p.variants?.[0]?.stock_quantity ?? 50,
              approval_status: p.approval_status || 'PENDING',
              status: p.is_active ? 'Active' : 'Inactive',
              active: p.is_active ?? true,
              is_active: p.is_active ?? true,
              image: p.image_url || '/placeholder-sweet.png',
              image_url: p.image_url || '/placeholder-sweet.png',
            }));
          }
        }
      }

      setProducts(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load products. Backend API is unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Open Edit Modal (Price & Status only)
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditPrice(product.price ? product.price.toString() : '');
    setEditActive(product.is_active ?? product.active ?? true);
    setModalError('');
    setOpenMenuId(null);
  };

  // Save Modal Changes
  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    if (!editPrice || Number(editPrice) <= 0) {
      setModalError('Please enter a valid price greater than 0.');
      return;
    }

    setModalSaving(true);
    setModalError('');

    try {
      const numPrice = Number(editPrice);

      // 1. Update in Supabase (Update price and active status, stock is managed separately in Inventory)
      try {
        await supabase
          .from('products')
          .update({ is_active: editActive })
          .eq('id', editingProduct.id);

        await supabase
          .from('product_variants')
          .update({
            vendor_price: numPrice,
            selling_price: Math.round(numPrice * 1.2),
            is_active: editActive
          })
          .eq('product_id', editingProduct.id);
      } catch (dbErr) {
        console.warn('Supabase update warning:', dbErr);
      }

      // 2. Try Backend PATCH
      try {
        await fetchApi(`/vendor/catalog/products/${editingProduct.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: editActive })
        }).catch(() => {});
      } catch {}

      // 3. Update in local state
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            price: numPrice,
            is_active: editActive,
            active: editActive,
            status: editActive ? 'Active' : 'Inactive'
          };
        }
        return p;
      }));

      showToast(`Listing details for "${editingProduct.name}" updated!`);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Error saving product changes:', err);
      setModalError(err.message || 'Failed to save product changes.');
    } finally {
      setModalSaving(false);
    }
  };

  // Toggle Active Status (Pause / Resume)
  const handleToggleActive = async (product: any) => {
    setOpenMenuId(null);
    setActionLoadingId(product.id);

    const currentActive = product.is_active ?? product.active ?? true;
    const newActive = !currentActive;

    try {
      // 1. Update in Supabase
      try {
        await supabase
          .from('products')
          .update({ is_active: newActive })
          .eq('id', product.id);

        await supabase
          .from('product_variants')
          .update({ is_active: newActive })
          .eq('product_id', product.id);
      } catch (dbErr) {
        console.warn('Supabase toggle error:', dbErr);
      }

      // 2. Try Backend
      try {
        await fetchApi(`/vendor/catalog/products/${product.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: newActive })
        }).catch(() => {});
      } catch {}

      // 3. Update local state
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          return {
            ...p,
            is_active: newActive,
            active: newActive,
            status: newActive ? 'Active' : 'Inactive'
          };
        }
        return p;
      }));

      showToast(newActive ? `Listing for "${product.name}" activated!` : `Listing for "${product.name}" paused.`);
    } catch (err: any) {
      console.error('Error toggling product status:', err);
      showToast('Failed to update product status.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product: any) => {
    setOpenMenuId(null);
    if (!confirm(`Are you sure you want to permanently delete "${product.name}" from your catalog?`)) {
      return;
    }

    setActionLoadingId(product.id);
    try {
      // 1. Delete variants & product from Supabase
      try {
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', product.id);

        await supabase
          .from('products')
          .delete()
          .eq('id', product.id);
      } catch (dbErr) {
        console.warn('Supabase delete error:', dbErr);
      }

      // 2. Try Backend
      try {
        await fetchApi(`/vendor/catalog/products/${product.id}`, {
          method: 'DELETE'
        }).catch(() => {});
      } catch {}

      // 3. Remove from local state
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`"${product.name}" deleted successfully.`);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      showToast('Failed to delete product.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.region || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: toastMessage.type === 'success' ? '#065f46' : '#991b1b',
          color: 'white',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 600,
          animation: 'slideIn 0.3s ease'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Title */}
      <div className="desktop-only" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>My Products</h1>
          <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Manage your inventory, pricing, and live catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/inventory" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            color: 'var(--royal-maroon)',
            border: '1.5px solid var(--royal-maroon)',
            padding: '10px 16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <Boxes size={18} /> View Stock Status
          </Link>
          <Link href="/products/add" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--royal-maroon)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(139, 29, 65, 0.2)'
          }}>
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Search Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Search dish, artisan vendor, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 42px', 
              borderRadius: '12px', 
              border: '1px solid var(--royal-border)', 
              outline: 'none',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          />
        </div>
        <button 
          onClick={() => loadProducts()}
          title="Refresh products"
          style={{ 
            padding: '12px', 
            background: 'white', 
            border: '1px solid var(--royal-border)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <Filter size={20} color="var(--royal-text-dark)" />
        </button>
      </div>
      
      {/* Loading & Error States */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="royal-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Skeleton width="80px" height="80px" borderRadius="12px" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Skeleton width="40%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="20%" height="12px" style={{ marginBottom: '8px' }} />
                <Skeleton width="30%" height="12px" style={{ marginBottom: '8px' }} />
                <Skeleton width="15%" height="12px" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'space-between' }}>
                <Skeleton width="18px" height="18px" style={{ marginBottom: '8px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <Skeleton width="60px" height="16px" />
                  <Skeleton width="100px" height="24px" borderRadius="6px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && !isLoading && (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px' }}>
          {error}
        </div>
      )}

      {/* Product List */}
      {!isLoading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--royal-text-gray)', background: 'white', borderRadius: '16px', border: '1px solid var(--royal-border)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🥘</div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--royal-text-dark)', fontWeight: 600 }}>No products found</h3>
              <p style={{ margin: '0 0 16px', fontSize: '14px' }}>
                {searchQuery ? 'Try clearing your search query.' : 'Add your first artisanal delicacy to get started!'}
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
                  <Plus size={16} /> Add First Product
                </Link>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isItemActive = product.is_active ?? product.active ?? true;
              const isActionLoading = actionLoadingId === product.id;

              return (
                <div 
                  key={product.id} 
                  className="royal-card" 
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'center',
                    opacity: isItemActive ? 1 : 0.65,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  
                  {/* Product Image */}
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--royal-cream)' }}>
                    {(product.image || product.image_url) ? (
                      <img 
                        src={product.image || product.image_url} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        🥘
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details (Middle) */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>{product.name}</h4>
                      {!isItemActive && (
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0', color: '#64748b' }}>
                          PAUSED
                        </span>
                      )}
                    </div>
                    {product.category && <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--royal-text-gray)' }}>{product.category}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: isItemActive ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                        • {isItemActive ? 'Listed on Website' : 'Paused / Hidden'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action & Price (Right) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'space-between', position: 'relative' }}>
                    
                    {/* 3-Dot Dropdown Trigger */}
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === product.id ? null : product.id);
                        }}
                        disabled={isActionLoading}
                        style={{ 
                          background: openMenuId === product.id ? '#f1f5f9' : 'transparent', 
                          border: 'none', 
                          padding: '6px', 
                          borderRadius: '8px', 
                          cursor: isActionLoading ? 'not-allowed' : 'pointer', 
                          color: 'var(--royal-text-gray)', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.15s ease'
                        }}
                        title="Manage product"
                      >
                        {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={18} />}
                      </button>

                      {/* Dropdown Menu Popup */}
                      {openMenuId === product.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            zIndex: 100,
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                            border: '1px solid #e2e8f0',
                            minWidth: '200px',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            animation: 'fadeIn 0.15s ease'
                          }}
                        >
                          <button
                            onClick={() => openEditModal(product)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#1e293b',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                          >
                            <Edit3 size={15} color="#3b82f6" />
                            Edit Listing & Price
                          </button>

                          <Link
                            href={`/inventory?search=${encodeURIComponent(product.name)}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#b45309',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fffbeb')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                          >
                            <Boxes size={15} color="#d97706" />
                            View Stock Status (Inventory)
                          </Link>

                          <button
                            onClick={() => handleToggleActive(product)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#1e293b',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                          >
                            {isItemActive ? (
                              <>
                                <Pause size={15} color="#d97706" />
                                Pause Listing
                              </>
                            ) : (
                              <>
                                <Play size={15} color="#16a34a" />
                                Activate Listing
                              </>
                            )}
                          </button>

                          <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                          <button
                            onClick={() => handleDeleteProduct(product)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#dc2626',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                          >
                            <Trash2 size={15} color="#dc2626" />
                            Delete Product
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Price and Status Tag */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginTop: '10px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--royal-text-dark)' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 600,
                        color: (product.approval_status || '').toLowerCase() === 'rejected' ? '#b91c1c' : ((product.approval_status || '').toLowerCase() === 'approved' || (product.approval_status || '').toLowerCase() === 'verified' ? '#28a745' : '#d97706'), 
                        background: (product.approval_status || '').toLowerCase() === 'rejected' ? '#fee2e2' : ((product.approval_status || '').toLowerCase() === 'approved' || (product.approval_status || '').toLowerCase() === 'verified' ? '#e6f4ea' : '#fef3c7'), 
                        padding: '4px 8px', 
                        borderRadius: '6px' 
                      }}>
                        {(product.approval_status || '').toLowerCase() === 'pending' ? 'Pending Approval' : ((product.approval_status || '').toLowerCase() === 'approved' || (product.approval_status || '').toLowerCase() === 'verified' ? 'Approved' : 'Rejected')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => !modalSaving && setEditingProduct(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Edit Listing & Price</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--royal-text-gray)' }}>{editingProduct.name}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                disabled={modalSaving}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
                {modalError}
              </div>
            )}

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Artisan Cost / Price (₹)
                </label>
                <input 
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="e.g. 120"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Listing Status
                </label>
                <select
                  value={editActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditActive(e.target.value === 'active')}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
                >
                  <option value="active">Active (Visible in store)</option>
                  <option value="inactive">Paused (Hidden from store)</option>
                </select>
              </div>

              <div style={{ padding: '10px 12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={16} color="#d97706" style={{ flexShrink: 0 }} />
                <span>Product stock & quantity is managed in the <strong>Inventory</strong> section.</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  disabled={modalSaving}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProductEdit}
                  disabled={modalSaving}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'var(--royal-maroon)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {modalSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}} />
    </div>
  );
}
