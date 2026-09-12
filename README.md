Reusable Auth System

A simple reusable authentication system built with Next.js, MongoDB and JavaScript.

I made this project so I can use the same authentication setup in my other Next.js projects instead of building login and authentication from scratch every time.

Features

- Register and login
- Email verification
- Forgot and reset password
- Google login
- Logout
- Protected pages
- Admin and customer roles
- Change password
- User profile
- Access and refresh tokens
- Session management
- Responsive UI
- 404 and error pages

Built With

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS
- MongoDB
- Mongoose
- JWT with JOSE
- bcryptjs
- Resend
- Google OAuth

Getting Started

First install the packages:

npm install

Create a ".env" file in the root folder and add your own values:

MONGODB_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

RESEND_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

NEXT_PUBLIC_APP_URL=http://localhost:3000

Do not upload your ".env" file to GitHub.

Start the project:

npm run dev

Then open:

http://localhost:3000

Google Login

For Google login, add this redirect URI in Google Cloud:

http://localhost:3000/api/auth/google/callback

Then add your Google Client ID and Client Secret to ".env".

Email

Resend is used for email verification and password reset emails.

For production, a verified email domain should be used.

Roles

The project currently has two roles:

- Customer
- Admin

More roles can be added later if needed.

Project Structure

src/
├── app/
│   ├── api/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── admin/
│   ├── profile/
│   ├── change-password/
│   └── lib/
├── components/
└── models/

Reusing This Project

The main purpose of this project is to use it as a starting point for other Next.js projects.

The authentication system can be connected to a new project and the project-specific pages and features can be added on top of it.