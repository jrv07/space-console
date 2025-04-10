-- schema.sql
-- mysql -u yourusername -p < schema.sql

CREATE DATABASE space_console;
USE space_console;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
EXIT;

