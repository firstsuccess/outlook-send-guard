import {content} from './content/translations';
import {language,type Language} from '../src/settings/model';
import {distributionText}from'../src/locales/distribution';
const ids=['overview','checks','install','setup','sending','faq','compatibility','privacy','terms','support'];
declare const __VERSION__:string;
declare const __ADDIN_BASE_URL__:string;
declare const __DOWNLOADS_ENABLED__:boolean;
const root=document.getElementById('site')!;
let selected:Language=language(navigator.language);try{const saved=localStorage.getItem('monja.language');if(saved&&['ja','en','zh-CN'].includes(saved))selected=saved as Language;}catch{/* Storage may be unavailable. */}
function add(tag:string,text:string,parent:HTMLElement){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
function render(){const c=content[selected];document.documentElement.lang=selected;document.title=c.title;root.replaceChildren();
const header=add('header','',root);const brand=add('a','MONJA / OUTLOOK SEND GUARD',header);(brand as HTMLAnchorElement).href='#top';const label=add('label','Language / 言語 / 语言 ',header);const select=document.createElement('select');select.setAttribute('aria-label','Language / 言語 / 语言');label.append(select);for(const [v,t]of[['ja','日本語'],['en','English'],['zh-CN','中文']]){const o=new Option(t,v,false,v===selected);select.add(o);}select.onchange=()=>{selected=select.value as Language;try{localStorage.setItem('monja.language',selected);}catch{}render();document.querySelector('select')?.focus();};
const hero=add('section','',root);hero.id='top';hero.className='hero';add('p',c.publisher+'　'+c.eyebrow,hero).className='eyebrow';add('h1',c.hero,hero);add('h2',c.title,hero);add('p',c.lead,hero);add('p',c.preview,hero).className='badge';const nav=add('nav','',root);nav.setAttribute('aria-label',c.title);c.nav.forEach((t,i)=>{const a=add('a',t,nav)as HTMLAnchorElement;a.href='#'+ids[i];});
const main=add('main','',root);c.sections.forEach((s,i)=>{const section=add('section','',main);section.id=ids[i];add('p',String(i+1).padStart(2,'0'),section).className='number';add('h2',s.title,section);if(i!==3&&i!==4)s.body.forEach(p=>add('p',p,section));
if(i===1){const wrap=add('div','',section);wrap.className='table-wrap';const table=add('table','',wrap);const tr=add('tr','',add('thead','',table));c.columns.forEach(v=>add('th',v,tr));const tbody=add('tbody','',table);c.features.forEach(row=>{const r=add('tr','',tbody);row.forEach(v=>add('td',v,r));});}
if(i===2){const labels=distributionText[selected];for(const edition of ['admin','user']as const){if(__DOWNLOADS_ENABLED__){const a=add('a',labels[edition]+' (XML)',section)as HTMLAnchorElement;a.href=__ADDIN_BASE_URL__+'/manifest-'+edition+'.xml';a.download='manifest-'+edition+'.xml';a.className='download';}else{const b=add('button',labels[edition]+' (XML)',section)as HTMLButtonElement;b.disabled=true;}}}
if(s.questions)s.questions.forEach(([q,a])=>{const d=add('details','',section);add('summary',q,d);add('p',a,d);});
if(i===9){const contact=add('a','https://first-success.com',section)as HTMLAnchorElement;contact.href='https://first-success.com';contact.target='_blank';contact.rel='noopener noreferrer';}
if(i===3||i===4){const d=add('details','',section);add('summary',c.nav[i],d);add('p',s.body.join('\n\n'),d);}
});const footer=add('footer','© 2026 First Success G.K. · MONJA '+__VERSION__,root);add('p','Microsoft Outlook / Microsoft 365 are trademarks of Microsoft Corporation.',footer);
}render();
