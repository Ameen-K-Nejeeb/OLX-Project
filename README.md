# OLX-Style Firebase Marketplace

A full-stack OLX-style marketplace built with React, Redux Toolkit, React Router, and Firebase services.

## Features

- Email/password registration and login with Firebase Authentication.
- Firebase session persistence through `onAuthStateChanged`.
- Redux Toolkit slices for auth, products, cart, and wishlist.
- Firestore-backed product listing, detail, create, and update flows.
- Product image URL field with preview before publishing.
- Protected Sell, Cart, and Wishlist routes.
- Search and category filters on the home listing grid.
- LocalStorage persistence for cart and wishlist.
- Responsive light/dark UI.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication with the Email/Password provider.
3. Create Firestore Database.
4. Copy `.env.example` to `.env` and fill in your Firebase web app config.

```bash
cp .env.example .env
```

Firestore collections used by the app:

- `users`
- `products`

Suggested development Firestore rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.sellerId;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
