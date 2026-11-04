import {sqliteTable,text,integer,uniqueIndex,index} from 'drizzle-orm/sqlite-core';
export const programEditions=sqliteTable('program_editions',{
 id:text('id').primaryKey(),programId:text('program_id').notNull(),recordId:text('record_id').notNull(),snapshot:text('snapshot_json').notNull(),createdAt:text('created_at').notNull()
},t=>[index('edition_program_idx').on(t.programId)]);
export const reviews=sqliteTable('reviews',{
 id:text('id').primaryKey(),editionId:text('edition_id').notNull().references(()=>programEditions.id),userKey:text('user_key').notNull(),stage:text('stage').notNull(),attendedOn:text('attended_on').notNull(),satisfaction:integer('satisfaction').notNull(),clarity:integer('clarity'),difficulty:text('difficulty').notNull(),tags:text('tags_json').notNull(),comment:text('comment').notNull(),status:text('status').notNull().default('published'),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()
},t=>[uniqueIndex('review_edition_user_unique').on(t.editionId,t.userKey),index('reviews_edition_idx').on(t.editionId,t.status)]);
