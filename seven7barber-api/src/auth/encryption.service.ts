import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const ENCRYPTION_KEY =
  process.env.OAUTH_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-cbc';

  async encrypt(text: string): Promise<string> {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  async decrypt(encryptedText: string): Promise<string> {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
