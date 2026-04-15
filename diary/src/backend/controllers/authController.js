import authService from '../services/authService.js';

class AuthController {
    /**
     * Handle user login request
     * POST /auth/login
     * Body: { username, password }
     */
    login(req, res) {
        try {
            const { username, password } = req.body;

            const result = authService.validateLogin(username, password);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    user: result.user,
                    token: result.token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during login'
            });
        }
    }

    /**
     * Handle user registration request
     * POST /auth/register
     * Body: { username, password }
     */
    register(req, res) {
        try {
            const { username, password } = req.body;

            const result = authService.registerUser(username, password);

            if (result.success) {
                return res.status(201).json({
                    success: true,
                    message: result.message,
                    user: result.user,
                    token: result.token
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during registration'
            });
        }
    }

    /**
     * Check if a username is available
     * GET /auth/check-username/:username
     */
    checkUsername(req, res) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            const exists = authService.usernameExists(username);

            return res.status(200).json({
                success: true,
                username: username,
                exists: exists,
                available: !exists
            });
        } catch (error) {
            console.error('Check username error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while checking username'
            });
        }
    }

    /**
     * Verify a JWT token
     * POST /auth/verify-token
     * Body: { token }
     */
    verifyToken(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token is required'
                });
            }

            const decoded = authService.verifyToken(token);

            if (decoded) {
                return res.status(200).json({
                    success: true,
                    message: 'Token is valid',
                    decoded: decoded
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during token verification'
            });
        }
    }
}

export default new AuthController();
