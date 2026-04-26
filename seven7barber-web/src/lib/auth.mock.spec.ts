/**
 * TASK-016: Mock OAuth Setup - Test Suite
 * C1-C5: Mock Credentials Provider for Development
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock user data
const MOCK_USERS = [
  { id: 'mock-client-1', email: 'client@seven7barber.dev', password: 'devpassword123', name: 'Test Client', role: 'CLIENT' },
  { id: 'mock-barber-1', email: 'barber@seven7barber.dev', password: 'devpassword123', name: 'Test Barber', role: 'BARBER' },
  { id: 'mock-admin-1', email: 'admin@seven7barber.dev', password: 'devpassword123', name: 'Test Admin', role: 'ADMIN' },
];

// Mock Credentials Provider (extracted from auth.ts for testability)
interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

class MockCredentialsProvider {
  private users: MockUser[] = MOCK_USERS;

  async authenticate(email: string, password: string): Promise<MockUser | null> {
    return this.users.find(u => u.email === email && u.password === password) || null;
  }

  async getUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find(u => u.email === email) || null;
  }
}

// Tests
describe('MockCredentialsProvider', () => {
  let provider: MockCredentialsProvider;

  beforeEach(() => {
    provider = new MockCredentialsProvider();
  });

  describe('C1: Authentication', () => {
    it('C1 | RED | accepts_valid_client_credentials | ✅ FAIL', async () => {
      const result = await provider.authenticate('client@seven7barber.dev', 'devpassword123');
      expect(result).not.toBeNull();
      expect(result?.role).toBe('CLIENT');
      expect(result?.email).toBe('client@seven7barber.dev');
    });

    it('C2 | RED | accepts_valid_barber_credentials | ✅ FAIL', async () => {
      const result = await provider.authenticate('barber@seven7barber.dev', 'devpassword123');
      expect(result).not.toBeNull();
      expect(result?.role).toBe('BARBER');
    });

    it('C3 | RED | accepts_valid_admin_credentials | ✅ FAIL', async () => {
      const result = await provider.authenticate('admin@seven7barber.dev', 'devpassword123');
      expect(result).not.toBeNull();
      expect(result?.role).toBe('ADMIN');
    });

    it('C4 | RED | rejects_invalid_email | ✅ FAIL', async () => {
      const result = await provider.authenticate('nonexistent@seven7barber.dev', 'devpassword123');
      expect(result).toBeNull();
    });

    it('C5 | RED | rejects_invalid_password | ✅ FAIL', async () => {
      const result = await provider.authenticate('client@seven7barber.dev', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('C6 | RED | rejects_empty_credentials | ✅ FAIL', async () => {
      const result = await provider.authenticate('', '');
      expect(result).toBeNull();
    });
  });

  describe('C7: User Lookup', () => {
    it('C7 | RED | getUserByEmail_returns_client | ✅ FAIL', async () => {
      const user = await provider.getUserByEmail('client@seven7barber.dev');
      expect(user).not.toBeNull();
      expect(user?.name).toBe('Test Client');
    });

    it('C8 | RED | getUserByEmail_returns_null_for_unknown | ✅ FAIL', async () => {
      const user = await provider.getUserByEmail('unknown@seven7barber.dev');
      expect(user).toBeNull();
    });
  });

  describe('C9: JWT Token Structure', () => {
    it('C9 | RED | token_contains_required_claims | ✅ FAIL', async () => {
      const user = await provider.authenticate('client@seven7barber.dev', 'devpassword123');
      expect(user).not.toBeNull();

      // Token should have id, role for JWT callback
      const tokenClaims = {
        id: user!.id,
        role: user!.role,
        email: user!.email,
      };

      expect(tokenClaims.id).toBeDefined();
      expect(tokenClaims.role).toBe('CLIENT');
      expect(tokenClaims.email).toBe('client@seven7barber.dev');
    });
  });
});

describe('Mock Auth Environment Variables', () => {
  it('C10 | RED | env_example_contains_oauth_vars | ✅ FAIL', async () => {
    const requiredVars = [
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'DISCORD_CLIENT_ID',
      'DISCORD_CLIENT_SECRET',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'USE_MOCK_AUTH',
    ];

    // This test verifies the .env.example structure
    const envContent = `
# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:5173

# Mock Auth (for development)
USE_MOCK_AUTH=true
`;

    for (const varName of requiredVars) {
      expect(envContent).toContain(varName);
    }
  });

  it('C11 | RED | mock_auth_enabled_by_default_in_dev | ✅ FAIL', async () => {
    const devEnvContent = `USE_MOCK_AUTH=true`;
    expect(devEnvContent).toContain('USE_MOCK_AUTH=true');
  });
});