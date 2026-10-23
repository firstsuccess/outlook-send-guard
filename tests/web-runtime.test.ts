import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildSync} from 'esbuild';

test('web runtime initializes Office and registers actions before host initialization',()=>{
 const html=readFileSync('public/commands.html','utf8');
 const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
 const office:any={actions:{associate:(name:string,handler:unknown)=>{assert.equal(name,'onMessageSend');assert.equal(typeof handler,'function');}}};
 const context={Office:office,setTimeout,clearTimeout};
 assert.match(scripts[0][1],/office\.js/);
 runInNewContext(scripts[1][2],context);
 assert.equal(typeof office.initialize,'function');
 assert.match(scripts[2][1],/src="\/launchevent\.js"/);
 assert.doesNotMatch(scripts[2][1],/defer|async/);
 // Execute the actual IIFE with no DOM/onReady available, as in the event runtime.
 let associated=false;office.actions.associate=(name:string,handler:unknown)=>{assert.equal(name,'onMessageSend');assert.equal(typeof handler,'function');associated=true;};
 const bundle=buildSync({entryPoints:['src/commands/index.ts'],bundle:true,format:'iife',target:'es2018',write:false});
 runInNewContext(bundle.outputFiles[0].text,context);
 assert.ok(associated);office.initialize();
});
