import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

class AuthService {
    validateLogin(username, password) {
        try {
            if (!username || !password) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Username and password are required'
                };
            }

            const user = userRepository.getUserByUsername(username);

            if (!user) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Invalid username or password'
                };
            }

            const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

            if (!isPasswordValid) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Invalid username or password'
                };
            }

            const token = this.generateToken(user.id, user.username);

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt
                },
                token,
                message: 'Login successful'
            };
        } catch (error) {
            return {
                success: false,
                user: null,
                token: null,
                message: `Login failed: ${error.message}`
            };
        }
    }

    usernameExists(username) {
        try {
            if (!username) {
                return false;
            }

            const user = userRepository.getUserByUsername(username);
            return user !== null;
        } catch (error) {
            console.error('Error checking username existence:', error);
            return false;
        }
    }

    registerUser(username, password) {
        try {
            if (!username || !password) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Username and password are required'
                };
            }

            if (username.length < 3) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Username must be at least 3 characters long'
                };
            }

            if (password.length < 6) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Password must be at least 6 characters long'
                };
            }

            if (this.usernameExists(username)) {
                return {
                    success: false,
                    user: null,
                    token: null,
                    message: 'Username already exists'
                };
            }

            const passwordHash = bcrypt.hashSync(password, 10);
            const newUser = userRepository.createUser(username, passwordHash);
            const token = this.generateToken(newUser.id, newUser.username);

            return {
                success: true,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    createdAt: newUser.createdAt
                },
                token,
                message: 'User registered successfully'
            };
        } catch (error) {
            return {
                success: false,
                user: null,
                token: null,
                message: `Registration failed: ${error.message}`
            };
        }
    }

    generateToken(userId, username) {
        return jwt.sign(
            { id: userId, username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return null;
        }
    }
}

export default new AuthService();
