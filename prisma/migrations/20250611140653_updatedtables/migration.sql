-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT DEFAULT 'https://res.cloudinary.com/etechds/image/upload/v1749650588/1_koh2sr.png',
ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "officeLocation" DROP NOT NULL;
