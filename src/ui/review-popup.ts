import type { Language } from '../settings/model';
export const popupText = {
  ja: { title: '下書きの確認結果', close: '閉じる' },
  en: { title: 'Draft review results', close: 'Close' },
  'zh-CN': { title: '草稿检查结果', close: '关闭' }
};
let dismiss:(()=>void)|undefined;
export function closeReviewPopup(){dismiss?.();}
/** Local modal only: mail data never enters a URL, storage or another window. */
export function showReviewPopup(text:string, language:Language, hasWarnings=false):Promise<void>{
  return new Promise((resolve,reject)=>{
    closeReviewPopup();
    const previous=document.activeElement as HTMLElement|null;
    const dialog=document.createElement('dialog');dialog.className='review-popup';
    const title=document.createElement('h2');title.id='review-popup-title';title.textContent=popupText[language].title;
    dialog.setAttribute('aria-labelledby',title.id);
    const result=document.createElement('p');result.className='review-popup-content'+(hasWarnings?' warning-result':'');result.textContent=text;
    const close=document.createElement('button');close.type='button';close.className='primary';close.textContent=popupText[language].close;
    dialog.append(title,result,close);document.body.append(dialog);
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;dismiss=undefined;result.textContent='';dialog.remove();previous?.focus();resolve();};
    dismiss=()=>{dialog.close();finish();};
    close.onclick=dismiss;
    dialog.addEventListener('close',finish,{once:true});
    dialog.addEventListener('cancel',e=>{e.preventDefault();dialog.close();});
    try{dialog.showModal();close.focus();}catch{dismiss=undefined;finished=true;result.textContent='';dialog.remove();reject(new Error('dialog-unavailable'));}
  });
}
