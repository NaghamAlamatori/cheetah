# 🚗 Car Marketplace Frontend

This is the **React-based frontend** for the Car Marketplace platform. It allows users to browse, search, filter, and communicate about cars for sale. The site supports **Arabic and English**, maintains a **professional orange and black theme**, and includes authentication and user profiles.

## 📁 Project Structure

```
frontend/
│── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│
│── src/
│   ├── components/ (Reusable UI components)
│   ├── pages/ (All main pages)
│   ├── context/ (Auth & Language Contexts)
│   ├── hooks/ (Custom Hooks)
│   ├── styles/ (CSS files)
│   ├── App.jsx
│   ├── index.jsx
│   ├── routes.jsx
│   └── config.js
│
│── .env (Environment Variables)
│── package.json (Dependencies)
│── vite.config.js (Configuration)
│── README.md (You are here!)
```

## 🚀 Features

✅ **Home Page** – Rotating images, search bar, featured cars.
✅ **Cars Page** – Browse and filter available cars.
✅ **Complaints Page** – Users can file and view complaints.
✅ **Authentication** – Login & Signup with authentication.
✅ **Reviews System** – User feedback and ratings.
✅ **Bilingual Support** – Arabic & English language switcher.
✅ **Sleek UI** – Professional orange & black theme.

## 🔧 Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/NaghamAlamatori/cheetah

   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   - Create a `.env` file and add:
   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## 📜 Tech Stack

- **Frontend:** React.js, Vite
- **State Management:** Context API
- **Authentication & Database:** Supabase
- **Styling:** CSS Modules / Tailwind CSS
