-- schema.sql
-- mysql -u yourusername -p < schema.sql
CREATE DATABASE IF NOT EXISTS space_console;
USE space_console;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
-- Optional: insert some dummy data
INSERT INTO users (username, email, password) VALUES
('admin', 'pururavamishra@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$DE7phcLOxvsp3uoOpM8exw$GRoddwZZ0Um26nXFI1OHoMU2TXT8yLSD0TBF+vVgnsQ');
