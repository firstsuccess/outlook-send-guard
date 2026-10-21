import { build } from 'esbuild';
import { mkdir,readFile,writeFile,cp,readdir } from 'node:fs/promises';
import { manifest } from './manifest.mjs';
import { downloadsAllowed } from './release-policy.mjs';
const c=JSON.parse((await readFile('config.json','utf8')).replace(/^\uFEFF/,''));
const pkg=JSON.parse((await readFile('package.json','utf8')).replace(/^\uFEFF/,''));
if(c.version!==pkg.version||!/^\d+\.\d+\.\d+$/.test(c.version))throw Error('Keep config.json and package.json versions equal (three numeric components)');
const dev=process.argv.includes('--dev'),dir=dev?'dist-dev':'dist';
const base=(process.env.ADDIN_BASE_URL || (dev?c.developmentUrl:c.productionUrl)).replace(/\/$/,'');
const u=new URL(base);if(u.protocol!=='https:'||(!dev&&/localhost|127\.0\.0\.1|\.invalid$/.test(u.hostname)))throw Error('HTTPS production URL required');
if(u.search||u.hash||u.pathname!=='/')throw Error('Use an HTTPS origin without path, query or fragment');
await mkdir(dir,{recursive:true});await cp('public',dir,{recursive:true});await cp('assets',`${dir}/assets`,{recursive:true});
const common={outdir:dir,bundle:true,format:'iife',target:'es2018',minify:!dev,define:{__WEBSITE_URL__:JSON.stringify(c.websiteUrl),__VERSION__:JSON.stringify(c.version),__DISTRIBUTION__:JSON.stringify('admin'),__ADDIN_BASE_URL__:JSON.stringify(base),__DOWNLOADS_ENABLED__:JSON.stringify(downloadsAllowed(c))},legalComments:'none'};
await build({...common,entryPoints:{taskpane:'src/ui/taskpane.ts',launchevent:'src/commands/index.ts',site:'site/index.ts'}});
await build({...common,entryPoints:{'taskpane-user':'src/ui/taskpane.ts'},define:{...common.define,__DISTRIBUTION__:JSON.stringify('user')}});
await writeFile(`${dir}/manifest-admin.xml`,manifest(c,base,'admin'));
await writeFile(`${dir}/manifest-user.xml`,manifest(c,base,'user'));
if(!dev){await writeFile('manifest-admin.xml',manifest(c,base,'admin'));await writeFile('manifest-user.xml',manifest(c,base,'user'));}
await writeFile(`${dir}/manifest.xml`,manifest(c,base));if(!dev)await writeFile('manifest.xml',manifest(c,base));
await writeFile(`${dir}/build-info.json`,JSON.stringify({version:c.version,base,hostingVerified:c.hostingVerified,downloadsEnabled:downloadsAllowed(c),releaseApproval:c.releaseApproval??null,development:dev},null,2));
if(!dev){for(const f of await readdir(dir)){if(/\.(html|js|xml|css)$/.test(f)&&/localhost|127\.0\.0\.1/.test(await readFile(`${dir}/${f}`,'utf8')))throw Error(`Development reference: ${f}`);}}
console.log(`Built ${dir}: ${base}; hosting verified: ${c.hostingVerified}`);
if(!dev)await import('./verify-dist.mjs');
