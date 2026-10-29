import {database,isAdmin,json,sameOrigin} from '../../../lib/auliv';
import {recordSchemas} from '../../../lib/validation';
export async function GET(){if(!await isAdmin())return json({error:'Authorised team access required.'},403);try{const db=database();const batches=await db.batch(['customers','enquiries','installations','services','amcs'].map(t=>db.prepare(`SELECT * FROM ${t} ORDER BY id DESC`)));return json(Object.fromEntries(['customers','enquiries','installations','services','amcs'].map((t,i)=>[t,batches[i].results])));}catch{return json({error:'Unable to load records.'},503)}}
export async function POST(request:Request){
 if(!sameOrigin(request)||!await isAdmin())return json({error:'Authorised team access required.'},403);
 try{const raw=await request.text();if(raw.length>14000)return json({error:'Request too large.'},413);const body=JSON.parse(raw);const entity=body.entity as keyof typeof recordSchemas;if(!Object.hasOwn(recordSchemas,entity))return json({error:'Unknown record type.'},400);const id=body.id===undefined?null:Number(body.id);if(id!==null&&(!Number.isSafeInteger(id)||id<1))return json({error:'Invalid record.'},400);if(entity==='enquiries'&&!id)return json({error:'Enquiries are created through the booking form.'},400);
 const parsed=recordSchemas[entity].safeParse(body.values);if(!parsed.success)return json({error:parsed.error.issues[0]?.message||'Check the record details.'},400);const values=parsed.data as Record<string,string|number>;const db=database();if('customerId' in values){const customer=await db.prepare('SELECT id FROM customers WHERE id=?').bind(values.customerId).first();if(!customer)return json({error:'Choose an existing customer.'},400);}
 const fields=Object.keys(values),params=Object.values(values);let result;
 if(id){result=await db.prepare(`UPDATE ${entity} SET ${fields.map(f=>`"${f}"=?`).join(',')} WHERE id=?`).bind(...params,id).run();if(!result.meta.changes)return json({error:'Record no longer exists.'},404);}
 else{result=await db.prepare(`INSERT INTO ${entity} (${fields.map(f=>`"${f}"`).join(',')},createdAt) VALUES (${fields.map(()=>'?').join(',')},?)`).bind(...params,new Date().toISOString()).run();}
 return json({ok:true,id:id||result.meta.last_row_id});
 }catch(e){const duplicate=String(e).includes('UNIQUE');if(duplicate)return json({error:'A customer with this phone already exists. Edit the existing customer.'},409);return json({error:'Couldn’t save the record. Please check the details and try again.'},400)}
}
