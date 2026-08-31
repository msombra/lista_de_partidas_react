CREATE TABLE "Championship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "championshipId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Club_championshipId_fkey" FOREIGN KEY ("championshipId") REFERENCES "Championship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "championshipId" INTEGER NOT NULL,
    "homeClubId" INTEGER NOT NULL,
    "awayClubId" INTEGER,
    "awayTeamName" TEXT,
    "weekDay" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "broadcast" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_championshipId_fkey" FOREIGN KEY ("championshipId") REFERENCES "Championship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayClubId_fkey" FOREIGN KEY ("awayClubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Championship_name_key" ON "Championship"("name");
CREATE INDEX "Club_championshipId_idx" ON "Club"("championshipId");
CREATE UNIQUE INDEX "Club_name_championshipId_key" ON "Club"("name", "championshipId");
CREATE INDEX "Match_championshipId_idx" ON "Match"("championshipId");
CREATE INDEX "Match_homeClubId_idx" ON "Match"("homeClubId");
CREATE INDEX "Match_awayClubId_idx" ON "Match"("awayClubId");
CREATE INDEX "Match_weekDay_time_idx" ON "Match"("weekDay", "time");
