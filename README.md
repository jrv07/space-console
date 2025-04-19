space-console is the AI-Powered Analytics Platform

project structure:

space-console/
├── client/             # React front-end
│   ├── src/
│   │   ├── components/
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.js
│   │   │   │   └── Profile.css
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
│   │   │   │   ├── TableVisualization.js
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
│   │   └── emailConfig.json    # Gmail credentials (can be removed if using .env)
│   ├── data/
│   │   └── data.json           # Mock chart data (unchanged)
│   ├── routes/
│   │   ├── auth.js             # Updated for MySQL, Argon2, 2FA
│   │   └── query.js            # Updated for multi-chart queries
│   ├── db.js                   # New: MySQL connection pool
│   ├── index.js                # Updated server with .env support
│   ├── .env                    # New: Stores DB and email credentials
│   ├── package.json            # Updated with mysql2, argon2, dotenv
│   └── node_modules/           # Server-side dependencies
|
├── .gitignore                  # Updated to ignore server/.env
└── README.md                   # Project documentation

Docker
*To properly shut down
docker-compose down -v

*To spin-up the whole application
docker-compose up --build

Fast API
*swagger
in /fastapiserver
https://localhost:8000/docs
With HTTPS Request
uvicorn main:app --host 0.0.0.0 --port 8000 --ssl-keyfile=key.pem --ssl-certfile=cert.pem

Open in browser and Authenticate (allow in browser)
https://127.0.0.1:8000/auth/login
To satrt mysql
mysql -u root -p
db_name: space_console