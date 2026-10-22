import {test,beforeEach} from 'node:test';import assert from 'node:assert/strict';
import {loadSettings,saveSettings,SETTINGS_KEY} from '../src/services/office';import {defaults} from '../src/settings/model';import {onMessageSend} from '../src/commands/handler';
import {reviewDraft}from'../src/services/manual';
let data:Record<string,unknown>,failSave:boolean,failRead:boolean,missingCallback:boolean;
beforeEach(()=>{data={};failSave=false;failRead=false;missingCallback=false;const get=(value:unknown)=>(cb:(r:unknown)=>void)=>{if(!missingCallback)cb({status:failRead?'failed':'succeeded',value});};
(globalThis as any).Office={AsyncResultStatus:{Succeeded:'succeeded'},CoercionType:{Text:'text'},context:{displayLanguage:'ja-JP',roamingSettings:{get:(k:string)=>data[k],set:(k:string,v:unknown)=>{data[k]=v;},remove:(k:string)=>delete data[k],saveAsync:(cb:(r:unknown)=>void)=>cb({status:failSave?'failed':'succeeded'})},mailbox:{item:{to:{getAsync:get([{emailAddress:'a@company.com'}])},cc:{getAsync:get([])},bcc:{getAsync:get([])},subject:{getAsync:get('Hello')},body:{getAsync:(_:unknown,cb:(r:unknown)=>void)=>get('Hello')(cb)},getAttachmentsAsync:get([])}}}};});
test('persist and reload settings',async()=>{const s=defaults();s.domains=['company.com'];await saveSettings(s);assert.deepEqual(loadSettings(),s);});
test('failed saves restore previous in-memory state',async()=>{data[SETTINGS_KEY]={...defaults(),domains:['old.com']};const previous=data[SETTINGS_KEY];failSave=true;await assert.rejects(saveSettings(defaults()));assert.deepEqual(data[SETTINGS_KEY],previous);});
test('failed first save removes temporary value',async()=>{failSave=true;await assert.rejects(saveSettings(defaults()));assert.equal(data[SETTINGS_KEY],undefined);});
async function send(){const calls:unknown[]=[];await onMessageSend({completed:(o:unknown)=>calls.push(o)}as any);return calls as {allowEvent:boolean;errorMessage?:string}[];}
test('clean message completes once with native confirmation in all locales',async()=>{
  for(const language of ['ja','en','zh-CN'] as const){
    (Office.context as any).requirements={isSetSupported:()=>true};
    data[SETTINGS_KEY]={...defaults(),domains:['company.com'],language};
    const c=await send();assert.equal(c.length,1);assert.equal(c[0].allowEvent,false);assert.ok(c[0].errorMessage);
    assert.doesNotMatch(c[0].errorMessage!,/検証できません|could not be checked|无法完成检查/);
    assert.equal((c[0] as Office.SmartAlertsEventCompletedOptions).errorMessageMarkdown,undefined);
  }
});
test('findings complete once with localized standard alert',async()=>{const c=await send();assert.equal(c.length,1);assert.equal(c[0].allowEvent,false);assert.match(c[0].errorMessage!,/社内ドメイン/);});
test('read failure is not a passed validation',async()=>{failRead=true;const c=await send();assert.equal(c[0].allowEvent,false);assert.match(c[0].errorMessage!,/検証できません/);});
test('future schema does not silently fall back',async()=>{data[SETTINGS_KEY]={schemaVersion:2};const c=await send();assert.equal(c[0].allowEvent,false);});
test('recipient API boundary is treated as incomplete',async()=>{(Office.context.mailbox.item as any).to.getAsync=(cb:any)=>cb({status:'succeeded',value:Array(500).fill({emailAddress:'a@company.com'})});data[SETTINGS_KEY]={...defaults(),domains:['company.com']};const c=await send();assert.equal(c[0].allowEvent,false);assert.match(c[0].errorMessage!,/検証できません/);});
test('manual review uses form values without persisting or sending',async()=>{const s=defaults();s.domains=['company.com'];const result=await reviewDraft(s,'ja');assert.match(result,/有効な警告項目は検出されません/);assert.match(result,/送信の許可・禁止は制御しません/);assert.equal(data[SETTINGS_KEY],undefined);});
test('manual review returns findings and non-inline attachment names',async()=>{(Office.context.mailbox.item as any).getAttachmentsAsync=(cb:any)=>cb({status:'succeeded',value:[{name:'report.pdf',isInline:false},{name:'logo.png',isInline:true}]});const result=await reviewDraft(defaults(),'en');assert.match(result,/Internal domains are not configured/);assert.match(result,/report.pdf/);assert.doesNotMatch(result,/logo.png/);});
test('manual read errors reject rather than reporting a passed check',async()=>{failRead=true;await assert.rejects(reviewDraft(defaults(),'ja'));});
test('manual review freezes form settings while Office reads are pending',async()=>{let finish:any;(Office.context.mailbox.item as any).to.getAsync=(cb:any)=>{finish=cb;};const s=defaults();s.domains=['company.com'];const pending=reviewDraft(s,'en');s.domains.length=0;finish({status:'succeeded',value:[{emailAddress:'a@company.com'}]});assert.match(await pending,/No enabled warnings detected/);});
test('manual review rejects stalled reads at its deadline',async(t)=>{t.mock.timers.enable({apis:['setTimeout']});missingCallback=true;const pending=reviewDraft(defaults(),'ja');t.mock.timers.tick(10000);await assert.rejects(pending,/manual-timeout/);});
test('deadline completes once even after stalled Office API',async()=>{missingCallback=true;const calls:any[]=[];void onMessageSend({completed:(o:unknown)=>calls.push(o)}as any);await new Promise(r=>setTimeout(r,4700));assert.equal(calls.length,1);assert.equal(calls[0].allowEvent,false);});
