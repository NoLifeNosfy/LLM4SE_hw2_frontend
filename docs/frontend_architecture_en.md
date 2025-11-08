# 🧱 Frontend Architecture Design Document

**Project Name:** Web-based AI Travel Planner  
**Version:** 1.0  
**Author:** [Your Name]  
**Date:** 2025-10-28  

---

## 1. Overview

This document describes the architecture, technology stack, and modular design of the **frontend system** for the *Web-based AI Travel Planner*.  
It aims to ensure consistency, scalability, and maintainability in frontend development.

---

## 2. Technology Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| Framework | Vue 3 (Composition API) | Core frontend framework |
| Build Tool | Vite | Fast development & HMR |
| State Management | Pinia | Lightweight global store |
| UI Library | Element Plus | Modern UI components |
| Map | vue-baidu-map-3x | Baidu Map for Vue 3 |
| HTTP Client | Axios | RESTful API requests |
| Authentication | JWT | Backend-compatible security |
| i18n | vue-i18n | Multilingual support |
| Charting | ECharts | Budget visualization |
| Code Quality | ESLint + Prettier | Code formatting & linting |

---

## 3. Project Structure

```
src/
 ├── api/
 │   ├── config.ts
 │   ├── user.ts
 │   ├── trip.ts
 │   └── budget.ts
 ├── assets/
 ├── components/
 │   ├── Map/
 │   │   ├── MapContainer.vue
 │   │   ├── MapMarkers.vue
 │   │   └── MapRoute.vue
 │   ├── VoiceInput.vue
 │   └── BudgetChart.vue
 ├── pages/
 │   ├── Home.vue
 │   ├── Login.vue
 │   ├── Planner.vue
 │   ├── Budget.vue
 │   └── MapView.vue
 ├── store/
 │   ├── userStore.ts
 │   ├── tripStore.ts
 │   └── budgetStore.ts
 ├── router/
 │   └── index.ts
 ├── i18n/
 │   ├── en.json
 │   └── zh.json
 ├── utils/
 │   ├── speech.ts
 │   └── helpers.ts
 ├── App.vue
 └── main.ts
```

---

## 4. Module Responsibilities

| Module | Responsibility |
|---------|----------------|
| **App.vue** | Root layout and router outlet |
| **api/** | Handles all backend REST API requests |
| **store/** | Global state (user, trip, budget) |
| **pages/** | Main page-level components |
| **components/** | Reusable components (map, charts, voice input) |
| **MapContainer.vue** | Initializes and manages Baidu Map |
| **MapMarkers.vue** | Displays POI markers |
| **MapRoute.vue** | Renders travel routes |
| **VoiceInput.vue** | Handles voice input and AI queries |
| **BudgetChart.vue** | Displays budget visualization |
| **i18n/** | Language files |
| **router/** | Page routing configuration |
| **utils/** | Utility functions |

---

## 5. Data Flow & Communication

User → Component → API → Backend → Pinia Store → UI Update



---

## 6. Development Guidelines

- Use **ESLint + Prettier** for formatting  
- File naming: lowercase-hyphen (e.g., `trip-planner.vue`)  
- Component naming: PascalCase (e.g., `MapContainer.vue`)  
- Use **Conventional Commits** style for Git messages  

---

## 7. Security & Performance

| Category | Policy |
|-----------|---------|
| **Authentication** | JWT authentication |
| **HTTPS** | All API requests via HTTPS |
| **Performance** | Lazy load components, async map loading |
| **Caching** | LocalStorage + Pinia persist |
| **Validation** | Input validation for security |

---

## 8. Backend Integration & Authentication

The frontend communicates with backend REST APIs for user, trip, event, location, route and expense modules.
All API requests include JWT tokens for authentication.
