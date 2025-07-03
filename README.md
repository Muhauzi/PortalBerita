
# 📚 PortalBerita

**PortalBerita** is a simple news portal web application built with **Laravel**, **React**, **Inertia.js**, and **shadcn/ui**.  
It features category-based news pages, a responsive gallery, and secure user authentication.

---

## 🚀 Features

✅ Dynamic news listing by category & subcategory  
✅ Image & video gallery section  
✅ User authentication (register, login, logout)  
✅ CRUD functionality for news posts & gallery items  
✅ Clean, responsive UI with React and shadcn/ui components  
✅ Inertia.js for server-driven SPA experience  
✅ MySQL database integration

---

## ⚙️ Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React + Inertia.js + shadcn/ui + Tailwind CSS
- **Database:** MySQL
- **Authentication:** Laravel Breeze or Fortify (or your custom setup)
- **Version Control:** Git, GitHub

---

## 📂 Project Structure

```
PortalBerita/
├── app/             # Laravel backend
├── resources/js/    # React components (Inertia pages, shadcn/ui)
├── resources/views/ # Inertia root view
├── routes/web.php   # Web routes
├── database/        # Migrations, seeders
├── public/          # Public assets
└── .env             # Environment variables
```

---

## 🛠️ Installation

Clone and set up the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/Muhauzi/PortalBerita.git
cd PortalBerita

# 2. Install backend dependencies
composer install

# 3. Install frontend dependencies
npm install

# 4. Copy .env and generate app key
cp .env.example .env
php artisan key:generate

# 5. Set up your database credentials in .env
# Then run migrations
php artisan migrate

# 6. Build frontend assets
npm run dev

# 7. Run the development server
php artisan serve
```

---

## 🔒 Authentication

This project includes basic user registration, login, and logout features.  
Authenticated users can manage protected content like news posts and gallery items.

---

## 🖼️ Gallery

A dedicated **Gallery** menu displays images and/or videos.  
Content is organized for a smooth, responsive browsing experience.

---

## 💡 Screenshots

> *Add screenshots or demo GIFs here to showcase the news page, gallery, and auth pages.*

---

## ✅ To-Do

- [ ] Add more categories & tags
- [ ] Enhance gallery filtering
- [ ] Improve UI animations & transitions
- [ ] Deploy to production (e.g., Vercel + Laravel backend)

---

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to improve something, please fork the repo, make your changes, and submit a PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Credits

Built with ❤️ by [Muhauzi](https://github.com/Muhauzi).
