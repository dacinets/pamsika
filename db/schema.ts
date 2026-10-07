import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const enquiries=sqliteTable('enquiries',{
 id:text('id').primaryKey(),
 reference:text('reference').notNull(),
 kind:text('kind').notNull(),
 name:text('name').notNull(),
 email:text('email').notNull(),
 business:text('business').notNull(),
 message:text('message').notNull(),
 details:text('details').notNull(),
 payloadHash:text('payload_hash').notNull(),
 consentAt:integer('consent_at').notNull(),
 createdAt:integer('created_at').notNull(),
});
