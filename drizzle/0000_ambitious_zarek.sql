CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`business` text NOT NULL,
	`message` text NOT NULL,
	`details` text NOT NULL,
	`payload_hash` text NOT NULL,
	`consent_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
