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

CREATE DATABASE IF NOT EXISTS final_table;
USE final_table;
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL
);
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
