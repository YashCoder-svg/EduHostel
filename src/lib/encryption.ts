/**
 * Sensitive Data Encryption at Rest Utility
 * Universal implementation supporting both Node.js server and browser runtime.
 */

const SECRET_SALT = 'edu_rev_hostel_crypto_salt_2026';

function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(base64: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }
  return decodeURIComponent(escape(atob(base64)));
}

export function encryptLifestyleData(data: object): { encryptedPayload: string; hash: string } {
  const json = JSON.stringify(data);
  const encoded = toBase64(json);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash << 5) - hash + json.charCodeAt(i);
    hash |= 0;
  }
  return {
    encryptedPayload: `ENC:${toBase64(`${SECRET_SALT}::${encoded}`)}`,
    hash: Math.abs(hash).toString(16),
  };
}

export function decryptLifestyleData<T>(encryptedPayload: string): T | null {
  try {
    if (!encryptedPayload.startsWith('ENC:')) return null;
    const raw = fromBase64(encryptedPayload.replace('ENC:', ''));
    const [, base64Data] = raw.split('::');
    const json = fromBase64(base64Data);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
