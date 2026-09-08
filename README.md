# 🎟️ Raffle Manager - School Event Platform

A modern, full-stack web application designed for high school graduating classes to manage, track, and audit a large-scale fundraising raffle (721 tickets across 3 classes). Built with Next.js, React 19, TypeScript, and Supabase.

---

## 💡 Problem & Solution

Managing physical raffle tickets across multiple students and classes often leads to lost records and manual accounting errors. 

This platform digitized the entire administrative process:
1. **Students** logged in using custom credentials, updated their initial password, and recorded sold tickets along with buyer details in real-time.
2. **Finance Committee** monitored sales metrics (percentages, totals, available tickets) and exported database records to draw the winning numbers and reward top student sellers.

---

## ✨ Core Features

- **Custom Student Onboarding:** Class selection and student roster integration with a mandatory initial password reset for security.
- **Student Dashboard:** Personalized portal where students view their assigned ticket numbers and log sales data (ticket number + buyer contact details).
- **Interactive Global Board:** Main public dashboard displaying all 720 ticket statuses in real-time.
- **Search & Real-time Metrics:** Search functionality by student or ticket number, including progress counters showing sales percentages, total sold, and remaining available tickets.
- **Data Audit & Winner Selection:** Structured database records to export complete buyer-seller lists for final prize draws and financial auditing.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router)
- **Frontend & UI:** React 19, TypeScript, Tailwind CSS v4, SweetAlert2
- **Backend & Database:** Supabase (`@supabase/supabase-js`)
- **Authentication & Security:** Custom JWT session handling (`jose`) & Password Hashing (`bcryptjs`)

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ash19-88/raffle-manager](https://github.com/Ash19-88/raffle-manager)
   cd raffle-manager

2. **Install dependencies:**
    ```bash
    npm install

3. **Run the development server:**
    ```bash
    npm run dev

📄 Project Context
Developed as a custom open-source solution for community event fundraising, handling real-world student user management, data tracking, and administrative financial exports.