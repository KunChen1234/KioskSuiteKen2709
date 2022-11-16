-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "locationName" TEXT,
    "BSSID" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_BSSID_key" ON "Location"("BSSID");

-- AddForeignKey
ALTER TABLE "LoginInfo" ADD CONSTRAINT "LoginInfo_LampBssid_fkey" FOREIGN KEY ("LampBssid") REFERENCES "Location"("BSSID") ON DELETE SET NULL ON UPDATE CASCADE;
