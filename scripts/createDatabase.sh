# Authors: Antonio Cabrera y Alejandro Gómez
# Description: Script para crear la base de datos y las tablas necesarias para el proyecto

# Creamos el usuario admin con contraseña password y le damos todos los privilegios
sudo mysql -e "CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';"
sudo mysql -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'password';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'localhost';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'%';"
sudo mysql -e "flush privileges;"

# Borramos la base de datos si existe y la creamos
sudo mysql -e "DROP DATABASE twitter;"
sudo mysql -e "CREATE DATABASE twitter;"

# Creamos las tablas
sudo mysql -D twitter -e "CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(50), password VARCHAR(100), failedAttempts INT NOT NULL, blocked BOOLEAN NOT NULL, keyword VARCHAR(50), avatar JSON, userSSID VARCHAR(100), createSSID VARCHAR(100), expiratedSSID VARCHAR(100) );"



