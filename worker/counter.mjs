export async function counterResponse(request, env) {
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  const method=request.method;
  if(!['GET','POST'].includes(method))return new Response(null,{status:405,headers:{...headers,Allow:'GET, POST'}});
  if(method==='POST' && (request.headers.get('Origin')!==new URL(request.url).origin || (request.headers.get('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site')!=='same-origin')))return new Response(null,{status:403,headers});
  if(method==='POST' && request.body!==null){const reader=request.body.getReader();const chunk=await reader.read();await reader.cancel();if(chunk.value?.byteLength)return new Response(null,{status:400,headers});}
  try {
    const row=await env.DB.prepare(method==='POST'
      ? 'INSERT INTO site_counter (id, views) VALUES (1, 1) ON CONFLICT(id) DO UPDATE SET views = views + 1 RETURNING views'
      : 'SELECT views FROM site_counter WHERE id = 1').first();
    const count=row?.views??0;
    if(!Number.isSafeInteger(count)||count<0)throw new Error('invalid-count');
    return new Response(JSON.stringify({count}),{headers});
  } catch {return new Response(JSON.stringify({error:'unavailable'}),{status:503,headers});}
}
