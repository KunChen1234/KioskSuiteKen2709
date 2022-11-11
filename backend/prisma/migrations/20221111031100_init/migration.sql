-- CreateTable
CREATE TABLE "LoginInfo" (
    "id" SERIAL NOT NULL,
    "serialnumber" TEXT NOT NULL,
    "LampMAC" TEXT NOT NULL,
    "LampSN" TEXT NOT NULL,

    CONSTRAINT "LoginInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginInfo" ADD CONSTRAINT "LoginInfo_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "User"("serialnumber") ON DELETE RESTRICT ON UPDATE CASCADE;
