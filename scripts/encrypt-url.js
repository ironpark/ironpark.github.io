// Simple script to encrypt the LinkedIn URL
// Run with: node scripts/encrypt-url.js

async function encryptAES(plainText, password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoder.encode(plainText)
  );
  
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

// Use a static password for client-side decryption
const PASSWORD = 'your-static-password-here';
const LINKEDIN_URL = 'https://www.linkedin.com/in/ironkr';

(async () => {
  const encrypted = await encryptAES(LINKEDIN_URL, PASSWORD);
  console.log('Encrypted LinkedIn URL:');
  console.log(encrypted);
})();