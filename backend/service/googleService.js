import { google } from "googleapis";
class GoogleService {
    constructor(authService) {
        this.authService = authService;
        this.googleClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }

    async gAuth() {

        const url = this.googleClient.generateAuthUrl({
            access_type:"offline",
            scope:[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ],
            prompt:"consent",
        })
        return url
    }

    async authenticateCallback(code) {

        const { tokens } = await this.googleClient.getToken(code)
        this.googleClient.setCredentials(tokens)

        const oauth2 = google.oauth2({ version: "v2", auth: this.googleClient });
        const { data } = await oauth2.userinfo.get();

        const username = data.name;
        const email = data.email;
        const password = "google";

        const user = await this.authService.registerGoogle(username, email, password);
        return user;
    }
}

export default GoogleService;