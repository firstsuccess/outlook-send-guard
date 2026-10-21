import { readMail } from './office';
import { validate } from '../validation/check';
import { messages } from '../commands/handler';
import { strings } from '../locales/strings';
import { distributionText } from '../locales/distribution';
import { parseSettings, type Settings, type Language } from '../settings/model';
export interface ReviewResult { text:string; hasWarnings:boolean }
export async function reviewDraftResult(settings:Settings,lang:Language):Promise<ReviewResult>{
  // Snapshot settings so edits made while Office reads are pending cannot alter the result.
  const snapshot=parseSettings(settings),t=strings[lang];
  let timer:ReturnType<typeof setTimeout>|undefined;
  const m=await Promise.race([readMail(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('manual-timeout')),10000);})]).finally(()=>clearTimeout(timer));
  const f=validate(m,snapshot);
  const text=(f.length?messages(f,lang).join('\n'):t.checked)+'\n'+t.files+': '+(m.attachments.filter(a=>a.isInline===false).map(a=>a.name).join(', ')||t.noFiles)+'\n\n'+distributionText[lang].resultHint;
  return {text,hasWarnings:f.length>0};
}

export async function reviewDraft(settings:Settings,lang:Language):Promise<string>{return (await reviewDraftResult(settings,lang)).text;}
