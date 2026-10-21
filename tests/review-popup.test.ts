import test from 'node:test';
import assert from 'node:assert/strict';
import {showReviewPopup,popupText} from '../src/ui/review-popup';
class Element {
  textContent='';className='';id='';type='';children:Element[]=[];events:Record<string,Function>={};onclick?:()=>void;removed=false;focused=false;
  append(...children:Element[]){this.children.push(...children);}setAttribute(){} focus(){this.focused=true;}
  addEventListener(name:string,fn:Function){this.events[name]=fn;}showModal(){}close(){this.events.close?.();}remove(){this.removed=true;}
}
test('manual popup renders untrusted results as text and clears them on close',async()=>{
  const body=new Element(),previous=new Element();
  (globalThis as any).document={body,activeElement:previous,createElement:()=>new Element()};
  const completed=showReviewPopup('<img src=x onerror=alert(1)>','ja');
  const dialog=body.children[0],result=dialog.children[1];
  assert.equal(result.textContent,'<img src=x onerror=alert(1)>');assert.doesNotMatch(result.className,/warning-result/);
  assert.equal(dialog.children[2].textContent,'閉じる');
  dialog.children[2].onclick!();await completed;
  assert.equal(result.textContent,'');assert.equal(dialog.removed,true);assert.equal(previous.focused,true);
  delete (globalThis as any).document;
});
test('Escape closes popup; all locales have a close label',async()=>{
  for(const lang of ['ja','en','zh-CN'] as const){
    const body=new Element();(globalThis as any).document={body,activeElement:null,createElement:()=>new Element()};
    const done=showReviewPopup('result',lang,true),dialog=body.children[0];
    assert.equal(dialog.children[2].textContent,popupText[lang].close);assert.match(dialog.children[1].className,/warning-result/);
    let prevented=false;dialog.events.cancel({preventDefault(){prevented=true;}});await done;
    assert.ok(prevented);assert.ok(dialog.removed);
  }delete (globalThis as any).document;
});
import {closeReviewPopup} from '../src/ui/review-popup';
test('item changes can dismiss and erase an open result without user action',async()=>{
 const body=new Element();(globalThis as any).document={body,activeElement:null,createElement:()=>new Element()};
 const done=showReviewPopup('previous message data','ja',true),dialog=body.children[0];
 closeReviewPopup();await done;assert.equal(dialog.children[1].textContent,'');assert.ok(dialog.removed);closeReviewPopup();delete (globalThis as any).document;
});
