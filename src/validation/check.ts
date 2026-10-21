import type { Settings, WarningKey } from '../settings/model';
export interface Recipient { emailAddress: string; recipientType?: string }
export interface Mail { to: Recipient[]; cc: Recipient[]; bcc: Recipient[]; subject: string; body: string; attachments: { name: string; isInline: boolean }[] }
export interface Finding { key: WarningKey | 'noDomains' | 'unresolved'; details: string[] }
export function distance(a: string, b: string): number {
  let row = Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){ const next=[i]; for(let j=1;j<=b.length;j++) next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1)); row=next; } return row[b.length];
}
export function similar(a: string,b: string): boolean {
  if(a===b) return false;
  const aa=a.replace(/rn/g,'m'), bb=b.replace(/rn/g,'m');
  return aa===bb || (Math.min(a.length,b.length)>=7 && distance(a,b)<=1);
}
export function authoredText(body: string): string {
  const lines=body.replace(/\r/g,'').split('\n'); const kept:string[]=[];
  for(const line of lines){
    if (/^\s*(?:[-_]{3,}\s*(?:Original Message|Forwarded message|元のメッセージ|转发邮件)|On .{1,200}wrote:|.{1,120}さんは書きました[:：]|From\s*[:：]|差出人\s*[:：]|发件人\s*[:：]|--\s*$)/i.test(line)) break;
    if(!/^\s*>/.test(line)) kept.push(line);
  } return kept.join('\n');
}
export function mentionsAttachment(body: string): boolean {
  const text=authoredText(body);
  return text.split(/[\n。!?！？]/).some(line => {
    if(/(?:no attachment|not attached|without (?:an? )?attachment|do not attach|don't attach|添付(?:は|を)?(?:しません|なし|不要|していません)|附件(?:不需要|无需)|没有附件|未附)/i.test(line)) return false;
    return /添付します|添付しました|添付ファイル|ファイルをお送りします|資料を添付|\battach(?:ed|ment|ments)\b|附件|已附上|随邮件附上/i.test(line);
  });
}
export function validate(mail: Mail, s: Settings): Finding[] {
  const out:Finding[]=[]; const all=[...mail.to,...mail.cc,...mail.bcc];
  const addresses=all.map(r=>r.emailAddress.trim().toLowerCase());
  const unresolved=all.filter(r=>! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.emailAddress) || /distribution|group/i.test(r.recipientType??''));
  if(unresolved.length) out.push({key:'unresolved',details:unresolved.map(r=>r.emailAddress)});
  if(!s.domains.length) out.push({key:'noDomains',details:[]});
  const external=addresses.filter(a=>!s.domains.includes(a.split('@')[1]??''));
  if(s.warnings.external && external.length) out.push({key:'external',details:[...new Set(external)]});
  if(s.warnings.duplicate){const seen=new Set<string>(),dupes=new Set<string>();addresses.forEach(a=>{if(seen.has(a))dupes.add(a);seen.add(a);});if(dupes.size)out.push({key:'duplicate',details:[...dupes]});}
  if(s.warnings.emptyTo&&!mail.to.length&&(mail.cc.length||mail.bcc.length))out.push({key:'emptyTo',details:[]});
  if(s.warnings.subject&&!mail.subject.trim())out.push({key:'subject',details:[]});
  if(s.warnings.similar){const matches=[...new Set(external)].filter(a=>s.domains.some(d=>similar(a.split('@')[1]??'',d)));if(matches.length)out.push({key:'similar',details:matches});}
  if(s.warnings.attachment&&mentionsAttachment(mail.body)&&!mail.attachments.some(a=>a.isInline===false))out.push({key:'attachment',details:[]});
  return out;
}
