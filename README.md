# EduGrant 🎓

EduGrant is a comprehensive, full-stack web application designed to streamline the application, tracking, and management of educational assistance programs. Built with modern web technologies, it provides a resilient experience for student applicants and a powerful, secure dashboard for administrators.

🌍 **Deployment Status:** Successfully deployed at the local barangay level and officially adopted for use in all future community educational assistance programs.

🟢 **Live Website:** [https://gabay-ayuda.vercel.app/](https://gabay-ayuda.vercel.app/)


## ✨ Key Features

### For Applicants
* **Resilient Multi-Step Application:** A 6-step form equipped with `sessionStorage` auto-saving. If an applicant accidentally refreshes or closes the page, their progress is saved without storing sensitive data permanently on shared devices.
* **Smart File Uploads:** Built-in client-side image compression shrinks massive mobile photos (like 4K iPhone images) before uploading, saving bandwidth and preventing server timeouts.
* **Real-Time Tracking:** Applicants receive a unique Tracking ID (e.g., `GA-XXXXXX`) to independently check their approval status.
* **Verification Security:** Access to specific grant batches is protected by deadlines, beneficiary limits, and verification codes.
* **Automated Notifications:** Applicants receive instant email updates when their application is approved or rejected.

### For Administrators
* **Role-Based Access Control:** Secure authentication routing for standard Admins and Super Admins.
* **Batch & Session Management:** Super Admins can create new assistance programs, set application deadlines, define maximum beneficiary limits, and assign specific admins to handle them.
* **Analytics Dashboard:** Real-time metrics tracking Total, Pending, Approved, and Rejected applications.
* **Application Review Portal:** A dedicated interface to review student data, verify uploaded documents (COE, COG, Valid ID) via secure signed URLs, and update statuses.
* **CSV Export:** Admins can export application records as a CSV file.


## 🛠️ Tech Stack

**Frontend**
* [Next.js](https://nextjs.org/) (App Router)
* React 19
* TypeScript
* CSS Modules (Custom Dark Theme UI)
* Lucide React (Icons)

**Backend & Infrastructure**
* **Next.js Server Actions:** For secure, API-free backend mutations.
* **Supabase:** PostgreSQL Database, Authentication, and Edge Storage (Document Uploads).
* **Zod:** For rigorous schema and form validation.
* **Browser Image Compression:** For lightweight mobile uploads.


## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Adrian7373/edugrant.git](https://github.com/Adrian7373/edugrant.git)
cd edugrant

```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

```

*(Note: The Service Role Key is required to safely bypass RLS for public user tracking and name verification).*

### 4. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.


## 📂 Project Structure Overview

* `/src/app/apply` - The public-facing, multi-step application form and success pages.
* `/src/app/track` - The public application status tracking interface.
* `/src/app/dashboard` - The secure admin dashboard and statistics views.
* `/src/app/records` - The admin portal for reviewing and updating individual applications.
* `/src/app/actions.ts` - Core Next.js Server Actions handling database interactions, validations, and email triggers.
* `/src/utils/supabase` - Supabase SSR client configurations.


Made with ❤️ by Adrian Ablaza
