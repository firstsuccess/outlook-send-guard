import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {extname} from 'node:path';
import {build} from 'esbuild';
const assets={};const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8'};
async function collect(dir,prefix=''){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='server')continue;const rel=prefix+'/'+e.name;if(e.isDirectory())await collect(dir+'/'+e.name,rel);else assets[rel]={data:(await readFile(dir+'/'+e.name)).toString('base64'),type:types[extname(e.name)]??'application/octet-stream'};}}
await collect('dist');await mkdir('dist/server',{recursive:true});
await build({stdin:{contents:"import {createWorker} from './worker/index.mjs';export default createWorker("+JSON.stringify(assets)+");",resolveDir:process.cwd()},outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
const manifest=JSON.parse(await readFile('.openai/hosting.json','utf8'));if(manifest.static||manifest.d1!=='DB')throw Error('Worker hosting configuration required');
await mkdir('dist/.openai',{recursive:true});await writeFile('dist/.openai/hosting.json',JSON.stringify(manifest,null,2));
console.log('Built Sites Worker with '+Object.keys(assets).length+' preserved static assets and a site-only counter.');
