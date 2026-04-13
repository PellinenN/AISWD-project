const bcrypt = require('bcrypt');

class User {
    constructor(id, username, password, createdAt) {
        this.id = id;
        this.username = username;
        this.passwordHash = bcrypt.hashSync(password, 10); // Hash the password with salt rounds of 10
        this.createdAt = createdAt;
    }

    // Method to verify a password against the stored hash
    verifyPassword(password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
}