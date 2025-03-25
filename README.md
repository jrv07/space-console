space-console is the AI-Powered Analytics Platform

project structure:

space-console/
├── client/             # React front-end
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   │   ├── Header.js
│   │   │   │   └── Header.css
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.js
│   │   │   │   └── Footer.css
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Navbar.css
│   │   │   ├── SearchBar/
│   │   │   │   ├── SearchBar.js
│   │   │   │   └── SearchBar.css
│   │   │   ├── Visualization/
│   │   │   │   ├── Visualization.js
│   │   │   │   └── Visualization.css
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   └── Dashboard.css
│   │   │   ├── Login/
│   │   │   │   ├── Login.js
│   │   │   │   └── Login.css
│   │   │   └── Signup/
│   │   │       ├── Signup.js
│   │   │       └── Signup.css
│   │   │   ├── MyBoard/
│   │   │   │   ├── MyBoard.js
│   │   │   │   └── MyBoard.css
│   │   │   ├── Data/
│   │   │   │   ├── Data.js
│   │   │   │   └── Data.css
│   │   │   ├── Templates/
│   │   │   │   ├── Templates.js
│   │   │   │   └── Templates.css
│   │   ├── redux/
│   │   │   └── store.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
|
├── server/
│   ├── config/
│   │   └── emailConfig.json  # Gmail credentials
│   ├── data/
│   │   ├── data.json    # Mock chart data
│   │   └── users.json   # User data
│   ├── routes/
│   │   ├── auth.js      # Login and signup routes
│   │   └── query.js     # Query route for charts
│   ├── index.js         # Main server file
│   └── package.json
└── README.md