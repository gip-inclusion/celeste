-- CreateTable
CREATE TABLE "ExecutionEvent" (
    "executionId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "ExecutionEvent_pkey" PRIMARY KEY ("executionId","eventId")
);

-- AddForeignKey
ALTER TABLE "ExecutionEvent" ADD CONSTRAINT "ExecutionEvent_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionEvent" ADD CONSTRAINT "ExecutionEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
