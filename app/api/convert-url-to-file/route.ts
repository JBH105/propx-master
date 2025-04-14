import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json();

    if (!fileUrl || typeof fileUrl !== 'string') {
      return NextResponse.json(
        { error: 'Valid fileUrl is required' },
        { status: 400 }
      );
    }

    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file from URL' },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || blob.type;
    const fileName = fileUrl.split('/').pop() || 'downloaded-file';

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}