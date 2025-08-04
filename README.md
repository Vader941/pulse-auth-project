# 📰 Pulse

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Pulse** is a comprehensive, full-stack web application that delivers daily utility in a clean, modern interface. Designed for users who want quick access to weather, news, movies, and personalized content, it features a sleek sidebar navigation and responsive design that works seamlessly across devices.

Built with **React**, **Node.js**, **Express**, **MongoDB**, **Tailwind CSS**, and featuring complete **user authentication**, **interactive maps**, and **API integrations** — Pulse demonstrates modern full-stack development practices with educational, beginner-friendly code documentation throughout.

---

## 🔍 Features

### � **Complete User Authentication System**
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt for security
- Protected routes and authentication guards
- Persistent login sessions with localStorage

### � **Advanced Weather Application**
- GPS-based automatic location detection
- Manual city/ZIP code search with intelligent formatting
- Interactive Leaflet maps with multiple weather layers (clouds, precipitation, temperature, wind, pressure)
- 5-day forecast with daily highs/lows
- Error handling with helpful user feedback

### � **Movie Discovery & Management**
- Popular movies display from TMDB API
- Advanced movie search functionality with detailed modals
- Save movies to personal favorites (authenticated users only)
- Movie posters, ratings, release dates, and descriptions

### 🏠 **Personalized Dashboard**
- Dynamic home page with user greeting and avatar
- Gravatar integration for user profile pictures
- Quick navigation to all app sections

### ⚙️ **User Preferences & Settings**
- Dark mode toggle with persistent storage
- Display name customization
- User avatar management via Gravatar
- Real-time settings updates

### 📰 **News Section (Ready for Enhancement)**
- Placeholder structure ready for news API integration
- Designed for future expansion with live headlines

### 🎨 **Modern UI/UX Design**
- Responsive design that works on all devices
- Clean sidebar navigation with active state indicators
- Smooth transitions and hover effects
- Professional styling with Tailwind CSS

---

## 🧠 Purpose

Pulse serves as both a **daily-use utility application** and a **comprehensive portfolio piece** showcasing modern full-stack development. It demonstrates:

### **Frontend Excellence**
- Advanced React patterns (hooks, context, refs, effects)
- Component-driven architecture with reusable patterns
- Responsive UI/UX design with Tailwind CSS
- Third-party library integration (Leaflet maps, Axios)
- State management and data flow
- Authentication workflows and protected routes

### **Backend Proficiency**
- RESTful API design with Express.js
- MongoDB database integration with Mongoose
- JWT authentication and authorization
- Password security with bcrypt hashing
- Error handling and input validation
- Environment variable management

### **Professional Development Practices**
- Clean, documented, and maintainable code
- Separation of concerns and modular architecture
- API integration and data processing
- Security best practices
- Educational code comments for learning

### **Real-World Application**
- Multiple API integrations (OpenWeatherMap, TMDB)
- Interactive mapping with weather overlays
- User account management and preferences
- Responsive design for all device sizes

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** (via Vite) - Modern component-based UI
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first styling framework
- **Leaflet** - Interactive mapping library
- **Axios** - HTTP client for API requests
- **JavaScript (ES6+)** - Modern JavaScript features

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing library

### **APIs & Services**
- **OpenWeatherMap API** - Weather data and forecasts
- **TMDB API** - Movie database and information
- **Gravatar** - User avatar service
- **Cloudflare Workers** - API proxy and optimization

### **Development Tools**
- **Vite** - Fast build tool and development server
- **Git** - Version control
- **npm** - Package management

---

## 📁 Project Structure

```
pulse-auth-project/
├── backend/                    # Node.js/Express backend
│   ├── models/                # MongoDB schemas
│   │   ├── User.js           # User account model
│   │   └── Movie.js          # Movie favorites model
│   ├── routes/               # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── user.js          # User management routes
│   │   └── movies.js        # Movie-related routes
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
├── pulse-frontend/           # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── Auth/       # Authentication components
│   │   ├── pages/          # Main application pages
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   ├── data/              # API proxy configurations
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.js     # Vite build configuration
│   └── package.json       # Frontend dependencies
├── package.json            # Root project configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or cloud)

### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd pulse-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the pulse-frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_WEATHER_API_URL=your_weather_api_endpoint
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### 🗄️ Database Setup
- **MongoDB**: Create a new database for the application
- **Collections**: User accounts and movie favorites are automatically created
- **Connection**: Ensure your MongoDB URI is correctly configured in the backend `.env` file

---

## 📈 Roadmap

### ✅ **Completed Features**
- [x] Full-stack authentication system with JWT
- [x] User registration and login workflows
- [x] Protected routes and authorization
- [x] Comprehensive weather application with maps
- [x] Movie search and favorites functionality
- [x] Responsive design for all devices
- [x] User preferences and account management
- [x] MongoDB integration with user profiles
- [x] API proxy setup with Cloudflare Workers

### 🚧 **In Development**
- [ ] Advanced user profile customization
- [ ] Enhanced movie recommendation engine
- [ ] Social features (sharing favorites)
- [ ] Mobile app companion

### 🔮 **Future Enhancements**
- [ ] Dynamic news module with live headlines
- [ ] Offline PWA support with service workers
- [ ] Real-time notifications for weather alerts
- [ ] Advanced weather analytics and history
- [ ] Integration with streaming platform APIs
- [ ] Dark/light theme preferences

---

## 🤝 Contributing

Pulse is currently a solo developer project, but feedback is welcome. Please open issues or reach out if you’re interested in collaboration.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌐 Live Demo

[🔗 View Pulse on GitHub Pages](https://vader941.github.io/Pulse)

---

## 👤 Author

**Nathan Able**  
[GitHub: @vader941](https://github.com/vader941)  
[Portfolio](https://vader941.github.io/01-prj-personal-site/)
