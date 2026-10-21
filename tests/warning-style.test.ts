import test from 'node:test';import assert from 'node:assert/strict';
import {warningOptions} from '../src/commands/handler';
import {reviewDraftResult} from '../src/services/manual';
import {defaults} from '../src/settings/model';
test('Smart Alerts bold formatting is escaped, bounded, localized and optional',()=>{
 for(const text of ['添付忘れを確認','Check attachment','请检查附件','[x](https://example.com) **fake**', '*'.repeat(480)]){
  (globalThis as any).Office={context:{requirements:{isSetSupported:()=>true}}};
  const result=warningOptions(text);assert.equal(result.errorMessage,text);assert.equal(result.allowEvent,false);assert.ok(result.errorMessageMarkdown!.startsWith('**'));assert.ok(result.errorMessageMarkdown!.endsWith('**'));assert.ok(result.errorMessageMarkdown!.length<=500);
 }
 assert.match(warningOptions('[x](https://example.com)').errorMessageMarkdown!,/\\\[/);
 (globalThis as any).Office={context:{requirements:{isSetSupported:()=>false}}};assert.equal(warningOptions('warn').errorMessageMarkdown,undefined);
 delete (globalThis as any).Office;
});
