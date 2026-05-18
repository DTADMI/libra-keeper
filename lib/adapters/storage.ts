// lib/adapters/storage.ts — Vendor-isolated storage adapter
//
// Abstracts Supabase Storage (or alternative) behind a local interface.
// Used for item cover images, user avatars, and exports.

export interface StorageClient {
  upload(
    bucket: string,
    path: string,
    file: Uint8Array | Blob,
    contentType?: string,
  ): Promise<StorageResult>;
  getPublicUrl(bucket: string, path: string): string;
  delete(bucket: string, paths: string[]): Promise<StorageResult>;
}

export interface StorageResult {
  success: boolean;
  error?: string;
}

class SupabaseStorageAdapter implements StorageClient {
  private url: string;
  private serviceKey: string;

  constructor(url: string, serviceKey: string) {
    this.url = url;
    this.serviceKey = serviceKey;
  }

  async upload(
    bucket: string,
    path: string,
    file: Uint8Array | Blob,
    contentType?: string,
  ): Promise<StorageResult> {
    try {
      const res = await fetch(`${this.url}/storage/v1/object/${bucket}/${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          "Content-Type": contentType ?? "application/octet-stream",
        },
        body: file as BodyInit,
      });

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: err };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    return `${this.url}/storage/v1/object/public/${bucket}/${path}`;
  }

  async delete(bucket: string, paths: string[]): Promise<StorageResult> {
    try {
      const res = await fetch(`${this.url}/storage/v1/object/${bucket}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: paths }),
      });

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: err };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}

class MockStorageAdapter implements StorageClient {
  async upload(_bucket: string, path: string, _file: Uint8Array | Blob): Promise<StorageResult> {
    console.log("[MockStorage] upload:", path);
    return { success: true };
  }

  getPublicUrl(bucket: string, path: string): string {
    return `/mock-storage/${bucket}/${path}`;
  }

  async delete(_bucket: string, paths: string[]): Promise<StorageResult> {
    console.log("[MockStorage] delete:", paths);
    return { success: true };
  }
}

function createStorageClient(): StorageClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    return new SupabaseStorageAdapter(url, serviceKey);
  }

  return new MockStorageAdapter();
}

export const storageClient: StorageClient = createStorageClient();
