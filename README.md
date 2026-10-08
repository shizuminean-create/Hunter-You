# MHF2 Hunter Helper — Android via GitHub Actions

Project ini membungkus `MHF2Full.jsx` menjadi APK Android menggunakan React + Vite + Tailwind CSS + Capacitor.

## Build utama: GitHub Actions

HP/Termux tidak perlu menjalankan Gradle. Cukup push source ke GitHub. Workflow akan:

1. install Node.js dan Java,
2. install Android SDK,
3. `npm install`,
4. build React/Vite,
5. membuat project Android dengan Capacitor,
6. menjalankan Gradle di runner GitHub,
7. meng-upload `app-debug.apk` sebagai artifact.

## Dari Termux

```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
git add .
git commit -m "Build APK MHF2"
git push origin main
```

Setelah push, buka tab **Actions** di repository GitHub → pilih **Build Android APK** → tunggu selesai → buka hasil run → bagian **Artifacts** → download `MHF2-Hunter-Helper-debug`.

> Folder `android/` sengaja tidak disimpan di repository. GitHub Actions membuatnya saat build, sehingga project tetap ringan untuk Termux/HP.

## Build lokal (opsional)

Kalau suatu saat ingin build di PC:

```bash
npm install
npm run android:sync
cd android
./gradlew assembleDebug
```
