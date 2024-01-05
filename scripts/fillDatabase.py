#!/home/antonio/.venv/bin/python3.11 
import pymysql
import crypt
import json

host = "3.211.29.216"
username = "admin"
password = "password"
db = "Twitter"

def crearUsuario(cursor, userId, userName, userPassword, avatar):
    # crear el usuario
    sql = "INSERT INTO UserTwitter (userId, userName, userPassword, failedAttempts, userBlocked, avatar) VALUES (%s, %s, %s, 0, false, %s)"
    cursor.execute(sql, (userId, userName, crypt.crypt(userPassword, 'salt'), avatar))
    # commit para guardar los cambios
    db.commit()

# conectar con la base de datos
db = pymysql.connect(host=host, user=username, password=password, db=db, connect_timeout=10, port=3306)

# preparar un objeto cursor usando el método cursor().
cursor = db.cursor()

# vaciar la tabla UserTwitter
cursor.execute("TRUNCATE TABLE UserTwitter")

# rellenar la base de datos usando el método execute()

crearUsuario(cursor, 1, "Antonio", "1234", json.dumps({"name":"Antonio", "surname":"Cabrera", "age": 20, "city": "Madrid", "email":"antonio@gmail.com"}))
