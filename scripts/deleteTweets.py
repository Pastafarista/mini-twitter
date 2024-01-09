#!/home/antonio/.venv/bin/python3.11
# Author: Antonio Cabrera y Alejandro Gómez
# Descripción: Elimina todos los tweets de la base de datos

import pymysql

host = "3.211.29.216"
username = "admin"
password = "password"
db = "twitter"

# conectar con la base de datos
db = pymysql.connect(host=host, user=username, password=password, db=db, connect_timeout=10, port=3306)

# preparar un objeto cursor usando el método cursor()
cursor = db.cursor()

# eliminar todos los tweets de la base de datos
sql = "TRUNCATE TABLE tweets"

try:
    # ejecutar el comando SQL
    cursor.execute(sql)
    # confirmar cambios en la base de datos
    db.commit()
except:
    # revertir cambios en caso de error
    print("Error al ejecutar el comando SQL")



