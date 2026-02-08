# 📚 StudyMate – Student Study Planner Mobile App

## 📌 Project Overview

StudyMate is a cross-platform mobile application designed to help students effectively plan, organize, and manage their academic activities.

With increasing academic workloads, students often struggle with time management, deadlines, and maintaining consistent study routines. StudyMate solves this problem by providing a centralized study planning platform where users can manage subjects, assignments, and study schedules in one place.

The application focuses on:
* **Productivity**
* **Organization**
* **Simplicity**
* **Better academic performance**

This project was developed using **React Native (Expo)** as part of the final coursework requirement for building a complete mobile application with authentication, state management, navigation, and CRUD operations.

---

## 🚀 Key Features

### 🔐 Authentication
* Secure login & logout
* Personal user accounts
* Protected routes
* Persistent sessions

### 📖 Subject Management (CRUD)
* Add subjects
* Edit subject details
* View subject list
* Delete subjects

### 🗓 Study Schedule Management (CRUD)
* Create study sessions
* Assign date & time
* Link to subjects
* Track upcoming sessions

### 📝 Assignment Tracking (CRUD)
* Add assignments
* Set priority levels
* Mark as completed
* Delete or update tasks

### 📊 Dashboard Overview
* Upcoming study sessions
* Pending assignments
* Completed tasks summary
* Quick workload visualization

### 👤 Profile Management
* Edit personal information
* Profile image upload (camera/gallery)
* Logout

### 🎨 UI/UX
* Clean modern interface
* Responsive mobile design
* Smooth navigation
* Easy-to-use layout

---

## 🛠 Tech Stack

### Frontend
* **React Native (Expo)**
* **TypeScript**
* **Expo Router**
* **NativeWind** (Tailwind CSS)

### State Management
* **React Context API**
* **Hooks**

### Backend / Data Persistence
* **Firebase Authentication**
* **Firestore Database**
* **Cloud image storage** (Cloudinary)

### Storage
* **AsyncStorage** (session persistence)

---

## 🧱 Architecture

StudyMate follows a modular and scalable structure:

```
app/
 ├─ (auth)/         → login/register screens
 ├─ (dashboard)/    → main app screens
 │    ├─ tasks/
 │    ├─ subjects/
 │    ├─ profile/
 │    └─ index.tsx
services/           → API/database logic
hooks/              → reusable hooks
components/         → UI components
context/            → global state
```

### Architecture Pattern
* **UI Layer** (Screens/Components)
* **Service Layer** (CRUD operations)
* **State Layer** (Context)
* **Backend** (Firebase/Cloud)

---

## ⚙️ Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/mahenabeywickrama/study-mate-app.git
cd studymate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Expo

```bash
npx expo start
```

### 4. Run on device
* **Android** → press `a`
* **iOS** → press `i`
* Or scan QR using Expo Go

---

## 📦 Build Instructions

### Android APK

```bash
eas build -p android
```

### iOS

```bash
eas build -p ios
```

---

## 📸 Screenshots

*(Add screenshots here)*

* Dashboard
* Tasks screen
* Subjects screen
* Profile page
* Authentication

---

## 🎥 Demo Video

👉 **YouTube Demo:** [Add link here]

---

## 📱 APK / Build

👉 **Download APK:** [Add link here]

---

## ✅ Coursework Requirements Coverage

| Requirement | Implemented |
|------------|-------------|
| Authentication | ✅ |
| CRUD Operations | ✅ |
| State Management | ✅ |
| Navigation | ✅ |
| Responsive UI | ✅ |
| Backend Integration | ✅ |
| Android/iOS Build | ✅ |
| Documentation | ✅ |

---

## 🧠 Learning Outcomes

Through this project, the following concepts were practiced:

* Cross-platform mobile development
* Authentication systems
* Database integration
* RESTful service architecture
* State management
* Navigation patterns
* Clean code practices
* Mobile UI/UX design

---

## ✨ Extra Features & Enhancements

* Profile image upload (camera/gallery)
* Task priority levels
* Dashboard analytics
* Pull-to-refresh
* Optimized rendering
* Modular services
* Scalable architecture

---

## 👨‍💻 Author

**Mahen Abeywickrama**  
Software Engineering Student

**GitHub:** https://github.com/mahenabeywickrama

---

## 📄 License

Developed for academic purposes.