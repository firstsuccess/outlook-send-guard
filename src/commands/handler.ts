import { loadSettings, readMail } from '../services/office';
import { validate, type Finding } from '../validation/check';
import { strings, resolveLanguage, boundedMessage } from '../locales/strings';
import { defaults, type Language } from '../settings/model';
export function messages(findings:Finding[],lang:Language):string[]{const t=strings[lang];return findings.map(f=>f.key==='unresolved'?t.failed+' '+f.details.slice(0,3).join(', '):t[f.key]+(f.details.length?': '+f.details.slice(0,5).join(', ')+(f.details.length>5?' …':''):''));}
export function warningOptions(text:string):Office.SmartAlertsEventCompletedOptions{
  const options:Office.SmartAlertsEventCompletedOptions={allowEvent:false,errorMessage:text};
  if(Office.context.requirements?.isSetSupported('Mailbox','1.15')){
    // Escape all message data before Markdown formatting. Never interpret addresses as links.
    let escaped='';
    for(const ch of text){const token=/[\\`*_{}\[\]()<>#!|~+\-.]/.test(ch)?'\\'+ch:ch==='\n'?'\n\n':ch;if(escaped.length+token.length>490){escaped+=' …';break;}escaped+=token;}
    options.errorMessageMarkdown='**'+escaped+'**';
  }
  return options;
}
export async function onMessageSend(event:Office.AddinCommands.Event):Promise<void>{
  let finished=false;let lang:Language='en';
  const complete=(options:Office.SmartAlertsEventCompletedOptions)=>{if(finished)return;finished=true;clearTimeout(timer);event.completed(options);};
  const timer=setTimeout(()=>complete(warningOptions(strings[lang].failed)),4500);
  try {
    lang=resolveLanguage(defaults(),Office.context.displayLanguage);
    const settings=loadSettings();lang=resolveLanguage(settings,Office.context.displayLanguage);
    const findings=validate(await readMail(),settings);
    const headings=findings.map(f=>f.key==='unresolved'?strings[lang].failed:strings[lang][f.key]);
    complete(findings.length?warningOptions(boundedMessage([headings.join(' / '),...messages(findings.filter(f=>f.details.length>0),lang)])):{allowEvent:true});
  } catch { complete(warningOptions(strings[lang].failed)); }
}
