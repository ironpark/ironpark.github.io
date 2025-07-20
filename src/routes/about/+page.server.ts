import type { PageServerLoad } from './$types';
import { encryptAES } from '$lib/utils/crypto';

const LINKEDIN_URL = 'https://www.linkedin.com/in/ironkr';
const ENCRYPTION_PASSWORD = 'your-static-password-here';

export const load: PageServerLoad = async () => {
  // Encrypt the LinkedIn URL on the server side
  const encryptedLinkedInUrl = await encryptAES(LINKEDIN_URL, ENCRYPTION_PASSWORD);
  
  return {
    encryptedLinkedInUrl,
    decryptPassword: ENCRYPTION_PASSWORD
  };
};