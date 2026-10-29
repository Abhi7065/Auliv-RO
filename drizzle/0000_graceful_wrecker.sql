CREATE TABLE `amcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerId` integer NOT NULL,
	`plan` text NOT NULL,
	`startsOn` text NOT NULL,
	`expiresOn` text NOT NULL,
	`status` text DEFAULT 'Active' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`locality` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_unique` ON `customers` (`phone`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`locality` text NOT NULL,
	`service` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`ipHash` text DEFAULT '' NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enquiries_reference_unique` ON `enquiries` (`reference`);--> statement-breakpoint
CREATE INDEX `enquiries_phone_created` ON `enquiries` (`phone`,`createdAt`);--> statement-breakpoint
CREATE INDEX `enquiries_ip_created` ON `enquiries` (`ipHash`,`createdAt`);--> statement-breakpoint
CREATE TABLE `installations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerId` integer NOT NULL,
	`model` text NOT NULL,
	`serial` text DEFAULT '' NOT NULL,
	`installedOn` text NOT NULL,
	`warrantyUntil` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerId` integer NOT NULL,
	`type` text NOT NULL,
	`scheduledOn` text NOT NULL,
	`status` text DEFAULT 'Scheduled' NOT NULL,
	`technician` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
