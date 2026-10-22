import { defaults, domain, warningKeys, type Settings, type Language } from '../settings/model';
import { strings, resolveLanguage } from '../locales/strings';
import { loadSettings, saveSettings } from '../services/office';
import { reviewDraftResult } from '../services/manual';
import { distributionText } from '../locales/distribution';
import { showReviewPopup, closeReviewPopup } from './review-popup';
let settings:Settings=defaults(), host='en', available=false, broken=false, saving=false, checking=false, status='', warningStatus='';
const root=document.getElementById('app')!;
let itemGeneration=0,hasItem=false;
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',parent:HTMLElement=root):HTMLElementTagNameMap[K]{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e;}
function render(){
  const lang=resolveLanguage(settings,host),t=strings[lang];document.documentElement.lang=lang;root.replaceChildren();
  el('p','MONJA / '+__VERSION__).className='eyebrow';el('h1','Monja Send Guard');el('p',t.intro);
  const mode=distributionText[lang];const managed=__DISTRIBUTION__==='admin';
  function addReviewButton(id:string){
    const check=el('button',t.checkNow);check.type='button';check.id=id;check.disabled=!available||!hasItem||saving||broken||checking;check.onclick=async()=>{
    const generation=itemGeneration;
    checking=true;warningStatus='';status=mode.checking;render();
    let result:string,hasWarnings:boolean;try{const reviewed=await reviewDraftResult(settings,lang);result=reviewed.text;hasWarnings=reviewed.hasWarnings;}catch{result=t.draftError;hasWarnings=true;}
    if(generation!==itemGeneration)return;
    warningStatus=hasWarnings?result:'';
    status='';render();
    try{await showReviewPopup(result,lang,hasWarnings);}catch{status=result;}
    if(generation!==itemGeneration)return;
    checking=false;render();document.getElementById(status?'status':id)?.focus();
  };
  }
  addReviewButton('review-draft-top');
  el('h2',managed?mode.admin:mode.user);el('p',managed?mode.adminHint:mode.userHint);el('p',mode.resultHint).className='hint';
  el('p',pinHint[lang]).className='hint';
  const label=el('label',t.locale);const select=el('select','',label);select.id='language';
  for(const [value,title] of [['auto',t.auto],['ja','日本語'],['en','English'],['zh-CN','中文']]){const o=el('option',title,select);o.value=value;o.selected=settings.language===value;}
  select.disabled=saving||checking;select.onchange=()=>{settings.language=select.value as Settings['language'];status='';render();document.getElementById('language')?.focus();};
  el('h2',t.domains);el('p',t.hint).className='hint';if(!settings.domains.length)el('p',t.noDomains);
  const list=el('ul');settings.domains.forEach((d,i)=>{const li=el('li',d,list);const b=el('button',t.remove,li);b.type='button';b.setAttribute('aria-label',t.remove+' '+d);b.disabled=saving||checking||broken;b.onclick=()=>{settings.domains.splice(i,1);status='';render();document.getElementById('domain')?.focus();};});
  const form=el('form');const dl=el('label',t.domains,form);const input=el('input','',dl);input.id='domain';input.type='text';input.autocomplete='off';input.placeholder='company.co.jp';input.maxLength=253;input.disabled=saving||checking||broken;
  const add=el('button',t.add,form);add.type='submit';add.disabled=saving||checking||broken;
  form.onsubmit=e=>{e.preventDefault();try{const d=domain(input.value);if(settings.domains.includes(d)||settings.domains.length>=100)throw Error();settings.domains.push(d);status='';render();document.getElementById('domain')?.focus();}catch{document.getElementById('status')!.textContent=t.invalid;input.focus();}};
  if(available){const email=Office.context.mailbox.userProfile.emailAddress;const suggestion=email?.split('@')[1];if(suggestion&&!settings.domains.includes(suggestion.toLowerCase())){const b=el('button',t.candidate+': '+suggestion);b.type='button';b.disabled=broken||saving||checking;b.onclick=()=>{input.value=suggestion;input.focus();};}}
  const field=el('fieldset');el('legend',t.checks,field);for(const k of warningKeys){const l=el('label','',field);l.className='toggle';const c=el('input','',l);c.type='checkbox';c.checked=settings.warnings[k];c.disabled=broken||saving||checking;c.onchange=()=>{settings.warnings[k]=c.checked;status="";document.getElementById("status")!.textContent="";};el('span',t[k],l);}
  const save=el('button',t.save);save.className='primary';save.disabled=!available||broken||saving||checking;save.onclick=async()=>{saving=true;status='';render();try{await saveSettings(settings);status=t.saved;}catch{status=t.error;}finally{saving=false;render();document.getElementById('status')?.focus();}};
  const reset=el('button',t.reset);reset.disabled=!available||saving||checking;reset.onclick=()=>{settings=defaults();broken=false;status=t.resetHint;render();};
  addReviewButton('review-draft');
  const p=el('p',status||(!available?t.preview:''));p.id='status';p.className=status&&status===warningStatus?'warning-result':'';p.tabIndex=-1;p.setAttribute('role','status');p.setAttribute('aria-live','polite');
  const a=el('a',t.help);a.href=__WEBSITE_URL__;a.target='_blank';a.rel='noopener noreferrer';
  const footer=el('footer');footer.className='publisher';el('span','By First Success G.K. ',footer);
  const publisher=el('a','https://first-success.com',footer);publisher.href='https://first-success.com';publisher.target='_blank';publisher.rel='noopener noreferrer';
}
declare const __WEBSITE_URL__:string;
declare const __VERSION__:string;
declare const __DISTRIBUTION__:'admin'|'user';
const pinHint={ja:'次回も表示するには、メール作成画面でこのパネル右上のピンを押してください。対応環境で利用できます。設定の保存とは別のOutlook操作です。',en:'To keep this pane open for future messages, select its pin while composing. Requires a supported client. Pinning is an Outlook action separate from saving settings.','zh-CN':'如需在下次撰写邮件时保留窗格，请在撰写窗口点击窗格顶部的固定图标。需要受支持环境。固定与保存设置不同。'};
render();
Office.onReady(info=>{if(info.host===Office.HostType.Outlook){available=true;hasItem=!!Office.context.mailbox.item;host=Office.context.displayLanguage;Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,()=>{itemGeneration++;closeReviewPopup();checking=false;status='';warningStatus='';hasItem=!!Office.context.mailbox.item;render();});try{settings=loadSettings();}catch{broken=true;status=strings[resolveLanguage(defaults(),host)].error;}render();}});
