-- AlterTable: Node.type from enum to open string (preserves existing values as text)
ALTER TABLE "Node" ALTER COLUMN "type" TYPE TEXT USING ("type"::text);

-- DropEnum
DROP TYPE "NodeType";
