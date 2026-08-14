export function unwrapProfile(data: any) {
  return data?.vendor || data?.data || data || {};
}

export function pickFirst(...values: Array<string | null | undefined>) {
  return values.map((v) => (typeof v === 'string' ? v.trim() : '')).find(Boolean) || '';
}

function titleCaseName(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function getShopName(p: any) {
  return pickFirst(p?.shopName, p?.storeName, p?.businessName, p?.shop_name, p?.store_name);
}

/** Backend currently copies shop name into ownerName — never show that as the person. */
export function nameFromEmail(email: string, shopName: string) {
  const local = (email.split('@')[0] || '').replace(/[0-9]+/g, '').replace(/[._-]+/g, ' ').trim();
  if (!local) return '';

  const shopTokens = shopName
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  const compact = local.replace(/\s+/g, '').toLowerCase();
  for (const token of shopTokens) {
    const idx = compact.indexOf(token);
    if (idx > 0) {
      return titleCaseName(`${compact.slice(0, idx)} ${compact.slice(idx)}`);
    }
  }

  if (local.includes(' ')) return titleCaseName(local);
  return titleCaseName(local);
}

export function getContactPersonName(p: any) {
  const shopName = getShopName(p);
  const combinedName = pickFirst(
    [p?.firstName, p?.lastName].filter(Boolean).join(' '),
    [p?.first_name, p?.last_name].filter(Boolean).join(' '),
  );
  const candidates = [
    p?.contactPerson,
    p?.contactPersonName,
    p?.contactName,
    p?.ownerName,
    p?.owner_name,
    p?.fullName,
    p?.full_name,
    combinedName,
  ];

  const distinct = candidates
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .find((v) => v && v.toLowerCase() !== shopName.toLowerCase());

  if (distinct) return distinct;

  const fromEmail = nameFromEmail(p?.email || '', shopName);
  if (fromEmail && fromEmail.toLowerCase() !== shopName.toLowerCase()) return fromEmail;

  return '';
}

export function mergeVendorProfile(fromApi: any, fromStorage: any = {}) {
  const merged = { ...fromStorage, ...fromApi };
  const shopName = getShopName(merged);
  const storedContact = pickFirst(fromStorage?.contactPerson, fromStorage?.ownerName);
  if (storedContact && storedContact.toLowerCase() !== shopName.toLowerCase()) {
    merged.ownerName = storedContact;
    merged.contactPerson = storedContact;
  }
  if (!getShopName(fromApi) && getShopName(fromStorage)) {
    merged.shopName = getShopName(fromStorage);
  }
  return merged;
}

export function loadStoredVendorProfile() {
  try {
    return unwrapProfile(JSON.parse(localStorage.getItem('vendor_profile') || '{}'));
  } catch {
    return {};
  }
}

export function persistVendorProfilePatch(patch: Record<string, unknown>) {
  const current = loadStoredVendorProfile();
  localStorage.setItem('vendor_profile', JSON.stringify({ ...current, ...patch }));
}
