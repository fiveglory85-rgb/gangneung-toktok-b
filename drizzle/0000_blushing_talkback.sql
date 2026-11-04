CREATE TABLE `program_editions` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`record_id` text NOT NULL,
	`snapshot_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `edition_program_idx` ON `program_editions` (`program_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`edition_id` text NOT NULL,
	`user_key` text NOT NULL,
	`stage` text NOT NULL,
	`attended_on` text NOT NULL,
	`satisfaction` integer NOT NULL,
	`clarity` integer,
	`difficulty` text NOT NULL,
	`tags_json` text NOT NULL,
	`comment` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`edition_id`) REFERENCES `program_editions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `review_edition_user_unique` ON `reviews` (`edition_id`,`user_key`);--> statement-breakpoint
CREATE INDEX `reviews_edition_idx` ON `reviews` (`edition_id`,`status`);