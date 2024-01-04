# Authors: Antonio Cabrera y Alejandro Gómez
# Description: Script para crear la base de datos y las tablas necesarias para el proyecto

# Creamos el usuario admin con contraseña password y le damos todos los privilegios
sudo mysql -e "CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';"
sudo mysql -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'password';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'localhost';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'%';"
sudo mysql -e "flush privileges;"

# Borramos la base de datos si existe y la creamos
sudo mysql -e "DROP DATABASE Twitter;"
sudo mysql -e "CREATE DATABASE Twitter;"

# Creamos las tablas
sudo mysql -D Twitter -e "CREATE TABLE UserTwitter (userId INT NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, PRIMARY KEY (userId));"
