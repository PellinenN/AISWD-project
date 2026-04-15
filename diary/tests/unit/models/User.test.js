import User from '../../../src/backend/models/User.js';

describe('User Model', () => {
  describe('Constructor', () => {
    it('should create a new User instance with all properties', () => {
      const now = new Date();
      const user = new User(1, 'testuser', '$2b$10$hash', now);

      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      expect(user.passwordHash).toBe('$2b$10$hash');
      expect(user.createdAt).toEqual(now);
    });

    it('should handle different id values', () => {
      const user1 = new User(1, 'user1', 'hash1', new Date());
      const user2 = new User(999, 'user999', 'hash999', new Date());

      expect(user1.id).toBe(1);
      expect(user2.id).toBe(999);
    });

    it('should preserve username exactly as provided', () => {
      const usernames = ['simple', 'with_underscore', 'with-dash', 'UPPERCASE', 'MixedCase'];
      const now = new Date();

      usernames.forEach((username) => {
        const user = new User(1, username, 'hash', now);
        expect(user.username).toBe(username);
      });
    });

    it('should preserve passwordHash as provided', () => {
      const hashes = ['$2b$10$hash123', 'plaintext', '', 'very_long_hash_string_here'];
      const now = new Date();

      hashes.forEach((hash) => {
        const user = new User(1, 'user', hash, now);
        expect(user.passwordHash).toBe(hash);
      });
    });

    it('should handle various date values', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-12-31T23:59:59'),
        new Date(0), // epoch
        new Date(),
      ];

      dates.forEach((date) => {
        const user = new User(1, 'user', 'hash', date);
        expect(user.createdAt).toEqual(date);
      });
    });
  });

  describe('Properties', () => {
    it('should be able to modify properties after creation', () => {
      const now = new Date();
      const user = new User(1, 'testuser', 'hash', now);

      user.username = 'newusername';
      user.passwordHash = 'newhash';

      expect(user.username).toBe('newusername');
      expect(user.passwordHash).toBe('newhash');
    });

    it('should maintain property independence between instances', () => {
      const now = new Date();
      const user1 = new User(1, 'user1', 'hash1', now);
      const user2 = new User(2, 'user2', 'hash2', now);

      user1.username = 'modified1';
      expect(user2.username).toBe('user2');
    });
  });
});
