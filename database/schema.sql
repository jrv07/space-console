-- schema.sql
-- mysql -u yourusername -p < schema.sql
CREATE DATABASE IF NOT EXISTS space_console;
USE space_console;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);
-- Optional: insert some dummy data
INSERT INTO users (username, email, hashed_password, role) VALUES
('admin', 'pururavamishra@gmail.com', '$2b$12$skiMJWReKrdiVqSi.UJO3.5Q70kQK17jK1vbptm2a2VQlBCWc78eW','admin');

USE space_console;
CREATE TABLE  sales_data (
    Date DATE NOT NULL,
    Account_ID INT NOT NULL,
    Account_Name VARCHAR(255) NOT NULL,
    Order_ID INT NOT NULL,
    Revenue FLOAT,
    Commission_Profit FLOAT,
    Status VARCHAR(255),
    Quantity INT,
    Target_Revenue FLOAT
);
LOAD DATA INFILE '/docker-entrypoint-initdb.d/dummy_sales_data.csv'
INTO TABLE sales_data
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(Date, Account_ID, Account_Name, Order_ID, Revenue, Commission_Profit, Status, Quantity, Target_Revenue);

