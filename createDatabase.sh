# Authors: Antonio Cabrera y Alejandro Gómez
# Description: Script para crear la base de datos y las tablas necesarias para el proyecto

sudo mysql -e "CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';"
sudo mysql -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'password';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'localhost';"
sudo mysql -e "GRANT ALL ON *.* TO 'admin'@'%';"
sudo mysql -e "flush privileges;"
sudo mysql -e "CREATE DATABASE Twitter;"

# Creamos las tablas
sudo mysql -D Twitter -e "CREATE TABLE UserTwitter (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL, PRIMARY KEY (id));"
