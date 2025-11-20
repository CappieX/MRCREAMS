const crypto = require('crypto');
const { query } = require('../config/database');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
    this.saltLength = 32; // 256 bits
  }

  /**
   * Generate encryption key from password
   */
  generateKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }

  /**
   * Generate random salt
   */
  generateSalt() {
    return crypto.randomBytes(this.saltLength);
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text, password) {
    try {
      const salt = this.generateSalt();
      const key = this.generateKey(password, salt);
      const iv = crypto.randomBytes(this.ivLength);
      
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('mrcreams-hipaa', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData, password) {
    try {
      const { encrypted, salt, iv, tag } = encryptedData;
      
      const key = this.generateKey(password, Buffer.from(salt, 'hex'));
      const decipher = crypto.createDecipher(this.algorithm, key);
      
      decipher.setAAD(Buffer.from('mrcreams-hipaa', 'utf8'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash PHI data for search purposes
   */
  hashPHI(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data + process.env.PHI_SALT);
    return hash.digest('hex');
  }

  /**
   * Encrypt PHI fields in database
   */
  async encryptPHIFields(tableName, recordId, phiFields, password) {
    try {
      const updates = {};
      
      for (const [field, value] of Object.entries(phiFields)) {
        if (value && typeof value === 'string') {
          const encrypted = this.encrypt(value, password);
          updates[`${field}_encrypted`] = JSON.stringify(encrypted);
          updates[`${field}_hash`] = this.hashPHI(value);
        }
      }

      if (Object.keys(updates).length > 0) {
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [recordId, ...Object.values(updates)];
        
        await query(
          `UPDATE ${tableName} SET ${setClause}, updated_at = NOW() WHERE id = $1`,
          values
        );
      }
    } catch (error) {
      console.error('Encrypt PHI fields error:', error);
      throw new Error('Failed to encrypt PHI fields');
    }
  }

  /**
   * Decrypt PHI fields from database
   */
  async decryptPHIFields(tableName, recordId, phiFields, password) {
    try {
      const selectFields = phiFields.map(field => 
        `${field}_encrypted, ${field}_hash`
      ).join(', ');

      const result = await query(
        `SELECT ${selectFields} FROM ${tableName} WHERE id = $1`,
        [recordId]
      );

      if (result.rows.length === 0) {
        return {};
      }

      const row = result.rows[0];
      const decryptedData = {};

      for (const field of phiFields) {
        const encryptedField = `${field}_encrypted`;
        const hashField = `${field}_hash`;
        
        if (row[encryptedField]) {
          try {
            const encryptedData = JSON.parse(row[encryptedField]);
            const decrypted = this.decrypt(encryptedData, password);
            decryptedData[field] = decrypted;
          } catch (error) {
            console.error(`Decrypt field ${field} error:`, error);
            decryptedData[field] = null;
          }
        }
      }

      return decryptedData;
    } catch (error) {
      console.error('Decrypt PHI fields error:', error);
      throw new Error('Failed to decrypt PHI fields');
    }
  }

  /**
   * Generate secure random password for PHI encryption
   */
  generateSecurePassword() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verify data integrity
   */
  verifyIntegrity(data, expectedHash) {
    const actualHash = this.hashPHI(data);
    return actualHash === expectedHash;
  }
}

module.exports = new EncryptionService();
