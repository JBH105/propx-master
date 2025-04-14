import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import path from "path";

// Configure Google Cloud Storage
let storage: Storage;
try {
  storage = new Storage({
    keyFilename: path.resolve(process.cwd(), "gcp-key.json")
  });
} catch (error: any) {
  console.error('Failed to initialize Google Cloud Storage:', error.message);
  throw error;
}

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  console.error('Environment variable GOOGLE_CLOUD_BUCKET_NAME is not set');
  throw new Error('Bucket name not configured');
}

const circleID = '67c5783641fdf927c31cfca6';

const bucket = storage.bucket(bucketName);

export async function DELETE(req: NextRequest) {
  try {
    // Parse request body
    const { fileName } = await req.json().catch((error) => {
      throw new Error(`Failed to parse JSON body: ${error.message}`);
    });

    // Validate fileName and circleID
    if (!fileName || !circleID) {
      return NextResponse.json({ error: 'File name and circleID are required' }, { status: 400 });
    }

    // Construct full file path with circleID
    const fullFileName = `${circleID}/${fileName}`;

    // Verify bucket exists
    const [bucketExists] = await bucket.exists().catch((error) => {
      throw new Error(`Failed to verify bucket: ${error.message}`);
    });
    if (!bucketExists) {
      throw new Error(`Bucket "${bucketName}" does not exist`);
    }

    // Check if file exists
    const file = bucket.file(fullFileName);
    const [fileExists] = await file.exists().catch((error) => {
      throw new Error(`Failed to check file existence: ${error.message}`);
    });
    if (!fileExists) {
      return NextResponse.json({ error: `File "${fullFileName}" not found` }, { status: 404 });
    }

    // Delete the file
    await file.delete({ ignoreNotFound: true }).catch((error: any) => {
      console.error('Delete operation error:', error.message);
      if (error.code === 404) {
        return NextResponse.json({ error: `File "${fullFileName}" not found` }, { status: 404 });
      }
      throw new Error(`Failed to delete file: ${error.message}`);
    });

    // Log successful deletion
    console.log(`File "${fullFileName}" deleted successfully`);

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete error details:', {
      message: error.message,
      stack: error.stack,
      fileName: req.body ? (await req.json().catch(() => ({}))).fileName : 'unknown',
      circleID: req.body ? (await req.json().catch(() => ({}))).circleID : 'unknown',
    });
    return NextResponse.json(
      { error: `Failed to delete file: ${error.message}` },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}