import {counterResponse} from './counter.mjs';
export function createWorker(assets){return {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/site-counter')return counterResponse(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});
 const path=url.pathname==='/'?'/index.html':url.pathname;
 const asset=assets[path];if(!asset)return new Response('Not found',{status:404});
 const body=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:body,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'}});
}};}
