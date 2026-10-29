import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
export function database(){if(!env.DB)throw new Error('Database unavailable');return env.DB;}
export async function isAdmin(){const user=await getChatGPTUser();const email=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return !!user&&!!email&&user.email.toLowerCase()===email.toLowerCase();}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin;}
export const serviceOptions=['New Auliv purifier','Purifier consultation','Repair & maintenance','Installation','Filter replacement','AMC enquiry'] as const;
