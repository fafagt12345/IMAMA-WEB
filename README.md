# IMAMA-WEB

## Deployment ke Vercel
1. Salin isi file .env.example ke variabel environment Vercel dengan nama yang sama.
2. Pastikan nilai VITE_FIREBASE_AUTH_DOMAIN sesuai domain Firebase Auth project Anda.
3. Pada Firebase Console, tambahkan domain berikut ke Authorized domains:
   - your-project-id.firebaseapp.com
   - your-project-id.web.app
   - domain Vercel Anda (contoh: nama-project.vercel.app)
4. Aktifkan Google provider di Authentication > Sign-in method.

## Verifikasi lokal
npm install
npm run build

