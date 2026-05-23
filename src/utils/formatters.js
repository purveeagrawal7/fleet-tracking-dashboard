export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export function formatLocation(lat, lng) {
  if (lat == null || lng == null) return '—';
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function getStatusConfig(status) {
  switch (status) {
    case 'delivered':
      return { label: 'DELIVERED', badgeClass: 'badge-delivered' };
    case 'en_route':
      return { label: 'EN ROUTE', badgeClass: 'badge-en-route' };
    case 'idle':
      return { label: 'IDLE', badgeClass: 'badge-idle' };
    default:
      return { label: status ? status.toUpperCase() : 'UNKNOWN', badgeClass: 'badge-idle' };
  }
}

export function formatSpeed(speed) {
  return speed != null ? `${speed} mph` : '—';
}

export function formatETA(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
