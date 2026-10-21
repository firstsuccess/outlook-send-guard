import assert from 'node:assert/strict';import{readFile,stat}from'node:fs/promises';
const text=async p=>readFile(`dist/${p}`,'utf8');
for(const p of ['index.html','site.js','site.css','taskpane.html','taskpane.js','taskpane-user.html','taskpane-user.js','commands-user.html','app.css','commands.html','launchevent.js','manifest.xml','manifest-admin.xml','manifest-user.xml','assets/icon-16.png','assets/icon-32.png','assets/icon-64.png','assets/icon-80.png','assets/icon-128.png'])assert.ok((await stat(`dist/${p}`)).size>0,p);
const js=await text('launchevent.js');assert.ok(!/\bimport\s*(?:\(|\{|\*)/.test(js),'Single event bundle');assert.ok(!/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/.test(js),'No mail network transmission');assert.ok(!/document\.|localStorage|sessionStorage/.test(js),'No DOM/browser storage in event runtime');
const xml=await text('manifest.xml');assert.ok(xml.includes('SendMode="PromptUser"'));assert.ok(xml.includes('<Permissions>ReadItem</Permissions>'));assert.ok(!/localhost|127\.0\.0\.1/.test(xml));
assert.equal(xml,await text('manifest-admin.xml'),'Default manifest remains administrator alias');
assert.doesNotMatch(await text('manifest-user.xml'),/OnMessageSend|LaunchEvent|launchevent.js/);
assert.doesNotMatch(await text('taskpane-user.js'),/actions\.associate/);
console.log('Static artifact checks passed: both editions, event runtime isolation, no network transport, production manifests.');
