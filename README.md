# 🛒 Smart Grocery List - A React Native App

Welcome to the Smart Grocery List app! This is a modern, feature-rich mobile application built with React Native and Expo, designed to make your grocery shopping experience smarter and more enjoyable.

## Purpose

This application is more than just a simple notetaker. It's a comprehensive tool to manage your shopping lists, providing smart features like AI-powered recipe suggestions and timely reminders, all wrapped in a sleek, dark-mode interface.

## ✨ Features

- **Dynamic List Management:** Easily add, delete, and check off items as you shop.
- **Automatic Sorting:** Completed items automatically move to the bottom of the list, keeping your active items in focus.
- **Persistent Storage:** Your list is saved directly on your device, so it's always there when you reopen the app.
- **🤖 AI Recipe Generator:** Don't know what to cook? With the tap of a button, the app uses the Groq API to generate a unique recipe based on the items currently on your list.
- **⏰ Local Reminders:** Schedule a local push notification to remind you to go shopping at a later time.
- **🎉 Fun Rewards:** Get a celebratory confetti explosion when you complete all the items on your list!
- **Secure API Key Handling:** API keys are kept safe and are not exposed in the codebase, using a `.env` file for security.
- **Clean, Modern UI:** A beautiful dark-mode interface that's easy on the eyes.

## 📸 Screenshots

Here's a look at the app in action:

<img width="1242" height="2688" alt="main-screen" src="https://github.com/user-attachments/assets/ea74ef82-8d28-4f3a-beff-fe56c3cd5513" />

<img width="1242" height="2688" alt="completed-items" src="https://github.com/user-attachments/assets/bbed2954-ba1b-4115-9da5-9698347f23fa" />

<img width="1242" height="2688" alt="ai-recipe-alert" src="https://github.com/user-attachments/assets/6c3dd9d4-6e9b-4957-97a3-e719003ea690" />

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)
- **Storage:** `@react-native-async-storage/async-storage`
- **AI Integration:** Groq API
- **Notifications:** `expo-notifications` & `expo-device`

## 🚀 Installation and Setup

Follow these instructions to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd grocery-list
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Your API Key

This app uses the Groq API for recipe generation.

1. Create a new file in the root of the project named `.env`.
2. Inside `.env` file, add your Groq API key:

```
GROQ_API_KEY=gsk_YourActualApiKeyHere

```

3. _Important_: The `.env` file is already listed in `.gitignore` to ensure your key is never commited to the repository.

### 4. Run the Application

Start the Expo development server. Scan the QR code with the Expo Go app on your iOS or Android device to see the app in action.

```
npm start
```

### File Structure

This project is organized with a clean and scalable structure:

- `App.tex`: The main entry point and primary screen of the application.
- `App.config.js`: The Expo configuration file, which securely loads the API key.
- `/src/components`: Contains reusable UI components like `ShoppingListItem.tsx` and the `icons.tsx` file.
- `/src/services`: Contains the business logic for interacting with external services, such as `aiService.ts` and `notificationService.ts`.

### Future Enhancements

- _Multiple Lists_: Allow users to create and manage different lists (e.g., "Weekly Groceries", "Party Supplies").
- _Item Categories_: Automatically categorize items (e.g.,"Dairy", "Produce") for more organized shopping.
- _Shared Lists_: Implement a backend to allow users to share and collaborate on lists in real-time.

Built with ❤️ for a smarter shopping trip.
