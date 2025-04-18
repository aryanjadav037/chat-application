import { isValid } from "zod";

export class SignupController {
    constructor(authService) {
        this.authService = authService;
    }

    async signup(req, res, next) {
        try {
            const { username, email, password, dob, role } = req.body;

            const result = await this.authService.register(
                username, email, password, dob, role
            );

            res.status(201).json({
                success: true,
                message: result.message || 'Signup successful. Please verify your email.'
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { token } = req.params;
            await this.authService.verifyEmail(token);
            res.redirect("http://localhost:5005/api/auth/login");
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req, res, next) {
        try {
            if (req.user) {
                return res.status(200).json({isValid : true})
            }
            return res.status(200).json({isValid : false})
        } catch (error) {
            next(error);
        }
    }
}

export class LoginController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.authenticate(email, password);

            //Local
            res.cookie("auth_token", token, {
                httpOnly: true,     // ✅ For security, protects from XSS
                secure: false,      // ✅ Use true only with HTTPS
                maxAge: 3600000,    // 1 hour
                sameSite: 'Lax',    // or 'None' with secure: true for cross-origin
            });

            //deployment
            // res.cookie("auth_token", token, {
            //     httpOnly: true,     // ✅ For security, protects from XSS
            //     secure: true,      // ✅ Use true only with HTTPS
            //     maxAge: 3600000,    // 1 hour
            //     sameSite: 'None',    // or 'None' with secure: true for cross-origin
            // });

            res.status(200).json({ success: true, token });
        } catch (error) {
           console.log(error) 
        }
    }

    async logout(req, res, next) {
        try {
            await this.authService.logout(res);
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            console.error("Logout error:", error);
            next(error);
        }
    }
}

