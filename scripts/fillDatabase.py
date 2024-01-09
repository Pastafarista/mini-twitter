#!/home/antonio/.venv/bin/python3.11 
# Author: Antonio Cabrera y Alejandro Gómez
# Description: Este script se encarga de rellenar la base de datos con los datos de los usuarios

import pymysql
import crypt
import json

host = "3.211.29.216"
username = "admin"
password = "password"
db = "twitter"

def crearUsuario(cursor, userId, userName, userPassword, keyword, avatar):
    # crear el usuario
    sql = "INSERT INTO users (id, name, password, failedAttempts, blocked, keyword, avatar) VALUES (%s, %s, %s, 0, false, %s, %s)"
    cursor.execute(sql, (userId, userName, crypt.crypt(userPassword, 'salt'), keyword, avatar))

    # commit para guardar los cambios
    db.commit()

# conectar con la base de datos
db = pymysql.connect(host=host, user=username, password=password, db=db, connect_timeout=10, port=3306)

# preparar un objeto cursor usando el método cursor().
cursor = db.cursor()

# vaciar la tabla UserTwitter
# cursor.execute("TRUNCATE TABLE users")

# rellenar la base de datos usando el método execute()

crearUsuario(cursor, 1, "Antonio", "1234", "platano", json.dumps({"name":"Antonio", "surname":"Cabrera", "age": 20, "city": "Madrid", "email":"antonio@gmail.com"}))
