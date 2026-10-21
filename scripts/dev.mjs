import https from 'node:https';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/build.mjs','--dev'],{stdio:'inherit'});
if(!process.env.DEV_TLS_KEY || !process.env.DEV_TLS_CERT)throw Error('Set DEV_TLS_KEY and DEV_TLS_CERT to a trusted localhost certificate and private key. See docs/LOCAL-TEST.md.');
const options={key:await readFile(process.env.DEV_TLS_KEY),cert:await readFile(process.env.DEV_TLS_CERT)};const root=resolve('dist-dev');
https.createServer(options,async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'https://localhost').pathname==='/'?'/index.html':new URL(req.url,'https://localhost').pathname));if(!path.startsWith(root+sep))throw Error();const data=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.png':'image/png','.xml':'application/xml'})[extname(path)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(3000,()=>console.log('https://localhost:3000 — local development only'));
