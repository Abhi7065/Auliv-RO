import {z} from 'zod';
import {serviceOptions} from './auliv';
const line=(n:number)=>z.string().trim().max(n);
export const phone=z.string().trim().transform(v=>{const digits=v.replace(/\D/g,'');return digits.length===12&&digits.startsWith('91')?digits.slice(2):digits}).refine(v=>/^[6-9]\d{9}$/.test(v),'Enter a valid 10-digit Indian mobile number.');
const email=z.union([z.literal(''),z.string().trim().email().max(150)]).default('');
export const enquirySchema=z.object({name:line(100).min(2),phone,email,locality:line(150).min(2),service:z.enum(serviceOptions),message:line(2000).default(''),website:line(200).default('')});
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v},'Choose a valid date.');
const customerId=z.coerce.number().int().positive();
export const recordSchemas={
 customers:z.object({name:line(100).min(2),phone,email,locality:line(150),address:line(500),notes:line(2000)}),
 installations:z.object({customerId,model:line(150).min(2),serial:line(150),installedOn:date,warrantyUntil:z.union([z.literal(''),date]),notes:line(2000)}).refine(v=>!v.warrantyUntil||v.warrantyUntil>=v.installedOn,'Warranty end must follow installation.'),
 services:z.object({customerId,type:line(150).min(2),scheduledOn:date,status:z.enum(['Scheduled','In progress','Completed','Cancelled']),technician:line(100),notes:line(2000)}),
 amcs:z.object({customerId,plan:line(150).min(2),startsOn:date,expiresOn:date,status:z.enum(['Active','Renewed','Cancelled']),notes:line(2000)}).refine(v=>v.expiresOn>=v.startsOn,'AMC expiry must follow its start date.'),
 enquiries:z.object({status:z.enum(['New','Contacted','Booked','Closed']),message:line(2000)})
};
