export type Language = 'ja' | 'en' | 'zh-CN';
export const warningKeys = ['external', 'attachment', 'subject', 'duplicate', 'emptyTo', 'similar'] as const;
export type WarningKey = typeof warningKeys[number];
export interface Settings { schemaVersion: 1; domains: string[]; language: Language | 'auto'; warnings: Record<WarningKey, boolean> }
export function defaults(): Settings { return { schemaVersion: 1, domains: [], language: 'auto', warnings: { external: true, attachment: true, subject: true, duplicate: true, emptyTo: false, similar: true } }; }
export function domain(value: string): string {
  const s = value.trim().toLowerCase();
  if (s.length > 253 || s.split('.').some(label=>label.length>63) || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/.test(s)) throw new Error('domain');
  return s;
}
export function parseSettings(raw: unknown): Settings {
  if (raw === undefined || raw === null) return defaults();
  if (typeof raw !== 'object' || Array.isArray(raw)) throw new Error('settings');
  const r = raw as Record<string, unknown>;
  // Version 1 is the initial schema. Unknown/future schemas must never silently reset safeguards.
  if (r.schemaVersion !== 1 || !Array.isArray(r.domains) || r.domains.length > 100) throw new Error('schema');
  const d = [...new Set(r.domains.map(v => { if (typeof v !== 'string') throw new Error('domain'); return domain(v); }))];
  if (!['auto','ja','en','zh-CN'].includes(r.language as string)) throw new Error('language');
  const w = r.warnings as Record<string, unknown> | undefined;
  if (!w || warningKeys.some(k => typeof w[k] !== 'boolean')) throw new Error('warnings');
  return { schemaVersion: 1, domains: d, language: r.language as Settings['language'], warnings: Object.fromEntries(warningKeys.map(k => [k, w[k]])) as Settings['warnings'] };
}
export function language(value: string): Language { return /^ja(?:-|$)/i.test(value) ? 'ja' : /^zh(?:-CN|-Hans)?$/i.test(value) || /^zh-Hans-/i.test(value) ? 'zh-CN' : 'en'; }
