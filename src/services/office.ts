import { parseSettings, type Settings } from '../settings/model';
import type { Mail } from '../validation/check';
export const SETTINGS_KEY='monja.settings.v1';
export function loadSettings(): Settings { return parseSettings(Office.context.roamingSettings.get(SETTINGS_KEY)); }
export function saveSettings(settings: Settings): Promise<void> {
  const value=parseSettings(settings), store=Office.context.roamingSettings, previous=store.get(SETTINGS_KEY);
  if(JSON.stringify(value).length>16000) return Promise.reject(new Error('capacity'));
  store.set(SETTINGS_KEY,value);
  return new Promise((resolve,reject)=>store.saveAsync(result=>{
    if(result.status===Office.AsyncResultStatus.Succeeded)resolve();
    else { if(previous===undefined)store.remove(SETTINGS_KEY);else store.set(SETTINGS_KEY,previous);reject(new Error('save')); }
  }));
}
function read<T>(run:(callback:(r:Office.AsyncResult<T>)=>void)=>void):Promise<T>{return new Promise((resolve,reject)=>run(r=>r.status===Office.AsyncResultStatus.Succeeded?resolve(r.value):reject(new Error('read'))));}
export async function readMail():Promise<Mail>{
  const item=Office.context.mailbox.item as Office.MessageCompose;
  const [to,cc,bcc,subject,body,attachments]=await Promise.all([
    read<Office.EmailAddressDetails[]>(cb=>item.to.getAsync(cb)),read<Office.EmailAddressDetails[]>(cb=>item.cc.getAsync(cb)),read<Office.EmailAddressDetails[]>(cb=>item.bcc.getAsync(cb)),
    read<string>(cb=>item.subject.getAsync(cb)),read<string>(cb=>item.body.getAsync(Office.CoercionType.Text,cb)),read<Office.AttachmentDetailsCompose[]>(cb=>item.getAttachmentsAsync(cb))
  ]);
  // Older supported classic clients cap getAsync at 500 per field. At the boundary
  // completeness cannot be proven consistently, so never report a complete check.
  if([to,cc,bcc].some(field=>field.length>=500))throw new Error('recipient-limit');
  return {to,cc,bcc,subject,body,attachments};
}
