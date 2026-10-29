// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const customers=sqliteTable('customers',{
 id:integer('id').primaryKey({autoIncrement:true}),name:text('name').notNull(),phone:text('phone').notNull().unique(),email:text('email').notNull().default(''),locality:text('locality').notNull().default(''),address:text('address').notNull().default(''),notes:text('notes').notNull().default(''),createdAt:text('createdAt').notNull()
});
export const enquiries=sqliteTable('enquiries',{
 id:integer('id').primaryKey({autoIncrement:true}),reference:text('reference').notNull().unique(),name:text('name').notNull(),phone:text('phone').notNull(),email:text('email').notNull().default(''),locality:text('locality').notNull(),service:text('service').notNull(),message:text('message').notNull().default(''),status:text('status').notNull().default('New'),ipHash:text('ipHash').notNull().default(''),createdAt:text('createdAt').notNull()
},t=>[index('enquiries_phone_created').on(t.phone,t.createdAt),index('enquiries_ip_created').on(t.ipHash,t.createdAt)]);
export const installations=sqliteTable('installations',{
 id:integer('id').primaryKey({autoIncrement:true}),customerId:integer('customerId').notNull().references(()=>customers.id),model:text('model').notNull(),serial:text('serial').notNull().default(''),installedOn:text('installedOn').notNull(),warrantyUntil:text('warrantyUntil').notNull().default(''),notes:text('notes').notNull().default(''),createdAt:text('createdAt').notNull()
});
export const services=sqliteTable('services',{
 id:integer('id').primaryKey({autoIncrement:true}),customerId:integer('customerId').notNull().references(()=>customers.id),type:text('type').notNull(),scheduledOn:text('scheduledOn').notNull(),status:text('status').notNull().default('Scheduled'),technician:text('technician').notNull().default(''),notes:text('notes').notNull().default(''),createdAt:text('createdAt').notNull()
});
export const amcs=sqliteTable('amcs',{
 id:integer('id').primaryKey({autoIncrement:true}),customerId:integer('customerId').notNull().references(()=>customers.id),plan:text('plan').notNull(),startsOn:text('startsOn').notNull(),expiresOn:text('expiresOn').notNull(),status:text('status').notNull().default('Active'),notes:text('notes').notNull().default(''),createdAt:text('createdAt').notNull()
});
