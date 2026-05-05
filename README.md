# 📚 BookShelf

A full-stack personal reading tracker built with Next.js, Prisma, and SQLite. Sign up, log books you're reading, rate them, and see stats about your reading habits.

---

## ✨ Features

- 🔐 **Authentication** — secure sign-up and login with JWT sessions and bcrypt-hashed passwords
- 📚 **Book management** — add, edit, and delete books with title, author, status, rating, and notes
- 🏷️ **Status tracking** — mark books as wishlist, currently reading, or finished
- ⭐ **Rating system** — rate finished books from 1 to 5 stars
- 🔍 **Filtering** — filter your bookshelf by status
- 📊 **Stats dashboard** — see total books, finished count, books read this year, and average rating
- 🛡️ **Per-user data isolation** — every API endpoint is scoped to the authenticated user
- 📱 **Responsive design** — looks great on any screen size

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** — React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** — type safety throughout
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Prisma](https://www.prisma.io/)** — type-safe ORM
- **[SQLite](https://sqlite.org/)** — lightweight embedded database
- **[NextAuth.js](https://next-auth.js.org/)** — authentication with credentials provider
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** — password hashing

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bookshelf.git
cd bookshelf
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and replace `NEXTAUTH_SECRET` with a long random string.

### 4. Set up the database

```bash
npx prisma db push
```

This creates the SQLite database file and generates the Prisma client.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
bookshelf/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── register/route.ts        # User registration
│   │   ├── books/
│   │   │   ├── route.ts                 # GET / POST books
│   │   │   └── [id]/route.ts            # PATCH / DELETE a book
│   │   └── stats/route.ts               # Reading statistics
│   ├── login/page.tsx                   # Login page
│   ├── register/page.tsx                # Sign-up page
│   ├── stats/page.tsx                   # Stats dashboard
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Home / bookshelf
├── components/
│   ├── AddBookForm.tsx
│   ├── BookCard.tsx
│   ├── Navbar.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts                          # NextAuth config
│   └── prisma.ts                        # Prisma client singleton
├── prisma/
│   └── schema.prisma                    # Database schema
└── package.json
```

---

## 🗃️ Data Model

```
User
├── id, email, password, name, createdAt
└── books (one-to-many)

Book
├── id, title, author, status, rating, notes
├── createdAt, updatedAt
└── userId (foreign key)
```

---

## 🔐 Security

- Passwords are hashed using bcrypt before being stored
- All API routes verify the JWT session before responding
- Database queries are scoped to the authenticated user's ID, preventing access to other users' data
- Cascading deletes ensure user data is fully removed if an account is deleted

---

## 🧰 Useful Commands

```bash
npm run dev          # Start the dev server
npm run build        # Build for production
npm run start        # Run production build
npm run db:push      # Push schema changes to the database
npm run db:studio    # Open Prisma Studio to inspect the database
```

---

## 📄 Licence

MIT — free to use and modify.
