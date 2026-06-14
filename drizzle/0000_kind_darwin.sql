CREATE TABLE `blog_comment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_id` int NOT NULL,
	`user_id` varchar(38) NOT NULL,
	`content` varchar(1000) NOT NULL,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `blog_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_like` (
	`blog_id` int NOT NULL,
	`user_id` varchar(38) NOT NULL,
	CONSTRAINT `blog_user_pk` PRIMARY KEY(`blog_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `blog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` varchar(300) NOT NULL,
	`content` text NOT NULL,
	`created_at` datetime,
	`updated_at` datetime,
	`archive` boolean DEFAULT false,
	`user_id` varchar(38) NOT NULL,
	CONSTRAINT `blog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poem_blog_correction_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`correction` varchar(1000) NOT NULL,
	`content_id` int NOT NULL,
	`content_type` enum('blog','poem'),
	`user_id` varchar(38) NOT NULL,
	`deadline` datetime NOT NULL,
	CONSTRAINT `poem_blog_correction_request_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_type_id_unique_index` UNIQUE(`content_id`,`content_type`)
);
--> statement-breakpoint
CREATE TABLE `poem_comment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poem_id` int NOT NULL,
	`user_id` varchar(38) NOT NULL,
	`content` varchar(1000) NOT NULL,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `poem_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poem_like` (
	`poem_id` int NOT NULL,
	`user_id` varchar(38) NOT NULL,
	CONSTRAINT `poem_user_pk` PRIMARY KEY(`poem_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `poem` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`content` text NOT NULL,
	`created_at` datetime,
	`updated_at` datetime,
	`archive` boolean DEFAULT false,
	`user_id` varchar(38) NOT NULL,
	CONSTRAINT `poem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poet_blogger_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sample` text NOT NULL,
	`user_id` varchar(38) NOT NULL,
	`request_date` datetime,
	`status` enum('requested','accepted','declined'),
	`role` enum('blogger','poet'),
	CONSTRAINT `poet_blogger_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` varchar(38) NOT NULL,
	`refresh` text NOT NULL,
	`user_id` varchar(38) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `user_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_account` (
	`id` varchar(38) NOT NULL,
	`name` varchar(64) NOT NULL,
	`username` varchar(64) NOT NULL,
	`email` varchar(254) NOT NULL,
	`password` varchar(255) NOT NULL,
	`joined_at` date,
	`about` varchar(1000),
	`role` enum('1019','2374','9802','9943') DEFAULT '1019',
	CONSTRAINT `user_account_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_account_username_unique` UNIQUE(`username`),
	CONSTRAINT `user_account_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `blog_comment` ADD CONSTRAINT `blog_comment_blog_id_blog_id_fk` FOREIGN KEY (`blog_id`) REFERENCES `blog`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_comment` ADD CONSTRAINT `blog_comment_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_blog_id_blog_id_fk` FOREIGN KEY (`blog_id`) REFERENCES `blog`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem_blog_correction_request` ADD CONSTRAINT `poem_blog_correction_request_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem_comment` ADD CONSTRAINT `poem_comment_poem_id_poem_id_fk` FOREIGN KEY (`poem_id`) REFERENCES `poem`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem_comment` ADD CONSTRAINT `poem_comment_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem_like` ADD CONSTRAINT `poem_like_poem_id_poem_id_fk` FOREIGN KEY (`poem_id`) REFERENCES `poem`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem_like` ADD CONSTRAINT `poem_like_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poem` ADD CONSTRAINT `poem_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poet_blogger_request` ADD CONSTRAINT `poet_blogger_request_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_session` ADD CONSTRAINT `user_session_user_id_user_account_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`id`) ON DELETE cascade ON UPDATE no action;