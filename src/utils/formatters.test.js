import { formatDate, formatLocation, getStatusConfig, formatSpeed, formatETA } from './formatters';

describe('formatDate', () => {
  it('returns — for null/undefined', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  it('formats an ISO string as dd/mm/yyyy, hh:mm:ss', () => {
    // Use a fixed UTC timestamp and check structure
    const result = formatDate('2024-03-15T10:05:03Z');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/);
  });
});

describe('formatLocation', () => {
  it('returns — when lat or lng is null', () => {
    expect(formatLocation(null, 77.5)).toBe('—');
    expect(formatLocation(12.9, null)).toBe('—');
    expect(formatLocation(null, null)).toBe('—');
  });

  it('formats lat/lng to 4 decimal places', () => {
    expect(formatLocation(12.9716, 77.5946)).toBe('12.9716, 77.5946');
  });

  it('rounds to 4 decimal places', () => {
    expect(formatLocation(12.97161234, 77.59461234)).toBe('12.9716, 77.5946');
  });
});

describe('getStatusConfig', () => {
  it('returns correct config for delivered', () => {
    const { label, badgeClass } = getStatusConfig('delivered');
    expect(label).toBe('DELIVERED');
    expect(badgeClass).toBe('badge-delivered');
  });

  it('returns correct config for en_route', () => {
    const { label, badgeClass } = getStatusConfig('en_route');
    expect(label).toBe('EN ROUTE');
    expect(badgeClass).toBe('badge-en-route');
  });

  it('returns correct config for idle', () => {
    const { label, badgeClass } = getStatusConfig('idle');
    expect(label).toBe('IDLE');
    expect(badgeClass).toBe('badge-idle');
  });

  it('uppercases unknown statuses and uses badge-idle', () => {
    const { label, badgeClass } = getStatusConfig('maintenance');
    expect(label).toBe('MAINTENANCE');
    expect(badgeClass).toBe('badge-idle');
  });

  it('returns UNKNOWN for null status', () => {
    const { label } = getStatusConfig(null);
    expect(label).toBe('UNKNOWN');
  });
});

describe('formatSpeed', () => {
  it('returns — for null/undefined', () => {
    expect(formatSpeed(null)).toBe('—');
    expect(formatSpeed(undefined)).toBe('—');
  });

  it('appends mph', () => {
    expect(formatSpeed(60)).toBe('60 mph');
    expect(formatSpeed(0)).toBe('0 mph');
  });
});

describe('formatETA', () => {
  it('returns — for null/undefined', () => {
    expect(formatETA(null)).toBe('—');
    expect(formatETA(undefined)).toBe('—');
  });

  it('returns time in hh:mm format', () => {
    const result = formatETA('2024-03-15T14:30:00Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
