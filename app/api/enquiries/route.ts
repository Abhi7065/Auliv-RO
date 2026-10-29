import {database,json as baseJson,sameOrigin} from '../../../lib/auliv';
import {enquirySchema} from '../../../lib/validation';
const pagesOrigin='https://abhi7065.github.io';
function reply(request:Request,data:unknown,status=200){const response=baseJson(data,status);if(request.headers.get('origin')===pagesOrigin){response.headers.set('Access-Control-Allow-Origin',pagesOrigin);response.headers.set('Vary','Origin');}return response;}
export async function OPTIONS(request:Request){if(request.headers.get('origin')!==pagesOrigin)return baseJson({error:'Invalid request origin.'},403);return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':pagesOrigin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}})}
export async function POST(request:Request){
 const json=(data:unknown,status=200)=>reply(request,data,status);
 if(!sameOrigin(request)&&request.headers.get('origin')!==pagesOrigin)return json({error:'Invalid request origin.'},403);
 if(Number(request.headers.get('content-length'))>12000)return json({error:'Request too large.'},413);
 try{const raw=await request.text();if(raw.length>12000)return json({error:'Request too large.'},413);const parsed=enquirySchema.safeParse(JSON.parse(raw));if(!parsed.success)return json({error:parsed.error.issues[0]?.message||'Please check your details.'},400);const v=parsed.data;if(v.website)return json({reference:'Received'});
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(request.headers.get('cf-connecting-ip')||'local-preview'));const ipHash=Array.from(new Uint8Array(hash)).map(v=>v.toString(16).padStart(2,'0')).join('');
 const db=database(),since=new Date(Date.now()-3600000).toISOString(),now=new Date().toISOString();const reference='AU-'+crypto.randomUUID().slice(0,8).toUpperCase();
 // An atomic INSERT ... SELECT enforces the hourly limit even for concurrent requests.
 const result=await db.prepare('INSERT INTO enquiries (reference,name,phone,email,locality,service,message,status,ipHash,createdAt) SELECT ?,?,?,?,?,?,?,\'New\',?,? WHERE (SELECT COUNT(*) FROM enquiries WHERE phone=? AND createdAt>?) < 3 AND (SELECT COUNT(*) FROM enquiries WHERE ipHash=? AND createdAt>?) < 8').bind(reference,v.name,v.phone,v.email,v.locality,v.service,v.message,ipHash,now,v.phone,since,ipHash,since).run();
 if(!result.meta.changes)return json({error:'You’ve sent several requests recently. Please call us or try again later.'},429);
 return json({reference},201);
 }catch(e){if(e instanceof SyntaxError)return json({error:'Invalid form data.'},400);console.error('Enquiry storage failed');return json({error:'We couldn’t save your request. Please try again or call +91 98998 46302.'},503);}
}
