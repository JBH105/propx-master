import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { nanoid } from 'nanoid';
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

const circleID = '67c5783641fdf927c31cfca6';

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  console.error('Environment variable GOOGLE_CLOUD_BUCKET_NAME is not set');
  throw new Error('Bucket name not configured');
}

const bucket = storage.bucket(bucketName);

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData().catch((error) => {
      throw new Error(`Failed to parse form data: ${error.message}`);
    });
    const file = formData.get('file') as File;

    // Validate file presence
    if (!file || !formData.get('fileName')) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, JPEG, PDF, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      return NextResponse.json({ error: 'File has no extension' }, { status: 400 });
    }
    const fileName = `${circleID}/${formData.get('fileName')}${nanoid()}.${fileExtension}`;

    // Verify bucket exists
    const [bucketExists] = await bucket.exists().catch((error) => {
      throw new Error(`Failed to verify bucket: ${error.message}`);
    });
    if (!bucketExists) {
      throw new Error(`Bucket "${bucketName}" does not exist`);
    }

    // Create a file in the bucket
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.type,
      },
    });

    // Convert File to Buffer
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch (error: any) {
      throw new Error(`Failed to convert file to buffer: ${error.message}`);
    }

    // Upload file
    await new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Blob stream error:', err.message);
        reject(new Error(`Upload stream error: ${err.message}`));
      });
      blobStream.on('finish', () => resolve(true));
      blobStream.end(buffer);
    });

    // Generate public URL (no makePublic() since bucket is public)
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ publicUrl, fileName }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message}` },
      { status: 500 }
    );
  }
}