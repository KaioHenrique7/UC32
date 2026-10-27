-- AlterTable
ALTER TABLE `complaints` ADD COLUMN `cycle_id` INTEGER NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `is_anonymous` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `photo_path` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `voting_cycles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `starts_at` DATETIME(3) NOT NULL,
    `ends_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `voting_cycles_starts_at_key`(`starts_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `complaint_id` INTEGER NOT NULL,
    `cycle_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `votes_complaint_id_idx`(`complaint_id`),
    INDEX `votes_cycle_id_idx`(`cycle_id`),
    UNIQUE INDEX `votes_user_id_cycle_id_key`(`user_id`, `cycle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `complaints_cycle_id_idx` ON `complaints`(`cycle_id`);

-- AddForeignKey
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `voting_cycles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_complaint_id_fkey` FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `voting_cycles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
