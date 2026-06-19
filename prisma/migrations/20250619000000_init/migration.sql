-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "configVersion" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT,
    "agencyType" TEXT,
    "yearsInBusiness" INTEGER,
    "saleTimeline" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "reportConsent" BOOLEAN NOT NULL DEFAULT false,
    "inputs" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "leadScore" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_token_key" ON "Submission"("token");
