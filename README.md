# Allergen Checker

This Next.js project uses Supabase as the data backend. To enable Firebase hosting or other Firebase services, basic Firebase configuration files have been added.

## Firebase setup
1. Install the Firebase CLI globally and sign in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Update `.firebaserc` with your Firebase project id.
3. Deploy the `public` folder or adjust `firebase.json` to your needs and run:
   ```bash
   firebase deploy
   ```

Environment variables for the Firebase SDK are expected to be prefixed with `NEXT_PUBLIC_FIREBASE_` as demonstrated in `firebase.js`.
