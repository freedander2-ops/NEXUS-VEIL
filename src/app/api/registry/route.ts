import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ContentRegistry } from '@/lib/content/schema';

const REGISTRY_PATH = path.join(process.cwd(), 'src/content/registry.json');

export async function GET() {
  try {
    const data = await fs.readFile(REGISTRY_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: 'Failed to read registry' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Basic session/auth check would happen here in production
    // For this atmospheric layer, we ensure the request is well-formed
    const newRegistry: ContentRegistry = await request.json();

    // Basic validation
    if (!newRegistry.objects || !Array.isArray(newRegistry.objects)) {
      return NextResponse.json({ error: 'Invalid registry format' }, { status: 400 });
    }

    // Write to file
    await fs.writeFile(REGISTRY_PATH, JSON.stringify({
      version: newRegistry.version,
      objects: newRegistry.objects,
      relationships: newRegistry.relationships || []
    }, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update registry' }, { status: 500 });
  }
}
