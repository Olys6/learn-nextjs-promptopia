import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@utils/database';
import User from '@models/user';

// Establish database connection
connectToDB();

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],

	// Optional: Define additional callbacks
	callbacks: {
		// Session callback
		async session({ session }) {
			const sessionUser = await User.findOne({
				email: session.user.email,
			});

			session.user.id = sessionUser.id.toString();

			return session;
		},
		async signIn({ profile }) {
			// Check if a user already exists
			const userExists = await User.findOne({
				email: profile.email,
			});

			if (!userExists) {
				await User.create({
					email: profile.email,
					username: profile.name
						.replace(/ /g, '')
						.toLowerCase(),
					image: profile.picture,
				});
			}

			return true; // Allow sign in
		},
	},
});

export { handler as GET, handler as POST };
