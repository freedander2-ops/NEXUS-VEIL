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

import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // In production, we'd check a secure cookie.
    // Here we check for the presence of the auth marker (as a simplified security layer)
    const cookieStore = await cookies();
    const hasAuth = cookieStore.get('nexus_veil_auth_proxy');

    if (!hasAuth) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // Actually, since we're using localStorage for auth in this alpha,
      // we'll assume the client must send a specific header for now.
    }

    const authHeader = request.headers.get('x-nexus-auth');
    if (authHeader !== 'active-operator-session') {
       return NextResponse.json({ error: 'Unauthorized: Missing Operator Token' }, { status: 401 });
    }

    const newRegistry: ContentRegistry = await request.json();

    // Schema validation
    if (!newRegistry.objects || !Array.isArray(newRegistry.objects)) {
      return NextResponse.json({ error: 'Invalid registry format: objects must be an array' }, { status: 400 });
    }

    // Ensure relationships and scenes are also validated if present
    if (newRegistry.relationships && !Array.isArray(newRegistry.relationships)) {
       return NextResponse.json({ error: 'Invalid registry format: relationships must be an array' }, { status: 400 });
    }
    if (newRegistry.scenes && !Array.isArray(newRegistry.scenes)) {
       return NextResponse.json({ error: 'Invalid registry format: scenes must be an array' }, { status: 400 });
    }

    // Write to file
    await fs.writeFile(REGISTRY_PATH, JSON.stringify({
      version: newRegistry.version || "1.0.0",
      objects: newRegistry.objects,
      relationships: newRegistry.relationships || [],
      scenes: newRegistry.scenes || []
    }, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update registry' }, { status: 500 });
  }
}
