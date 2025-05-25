import fs from "fs";
import unzipper from "unzipper";
import { parseDocument } from "htmlparser2";
import AWS from "aws-sdk";
const { S3 } = AWS;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("🧪 ENV:", {
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION,
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY ? "✅" : "❌",
});

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function parseEpub(epubPath, titleId) {
  const epubBuffer = fs.readFileSync(epubPath);
  const zip = await unzipper.Open.buffer(epubBuffer);
  const htmlFiles = zip.files.filter(
    (f) => f.path.endsWith(".xhtml") || f.path.endsWith(".html")
  );

  let chapterIndex = 1;
  for (const file of htmlFiles) {
    const content = await file.buffer();
    const html = content.toString();

    await s3
      .putObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `titles/${titleId}/chapter_${chapterIndex}.html`,
        Body: html,
        ContentType: "text/html",
      })
      .promise();

    console.log(`Uploaded chapter_${chapterIndex}.html`);
    chapterIndex++;
  }

  console.log(
    `Done. Uploaded ${chapterIndex - 1} chapters for title "${titleId}"`
  );
}

// ---- CLI виклик
const args = process.argv.slice(2);
const [epubPath, titleId] = args;

if (!epubPath || !titleId) {
  console.error("Usage: node tools/epub-parser.js <path-to-epub> <titleId>");
  process.exit(1);
}

await parseEpub(epubPath, titleId);
