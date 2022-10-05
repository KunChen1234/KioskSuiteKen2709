-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "serialnumber" TEXT,
    "name" TEXT,
    "section" TEXT,
    "photo" TEXT,
    "job" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
