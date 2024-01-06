#!/home/antonio/.venv/bin/python3.11

import pymysql

host = "3.211.29.216"
username = "admin"
password = "password"
db = "twitter"

# conectar con la base de datos
db = pymysql.connect(host=host, user=username, password=password, db=db, connect_timeout=10, port=3306)

# preparar un objeto cursor usando el método cursor()
cursor = db.cursor()

# setear el atributo userBlocked a 0 para todos los usuarios
sql = "UPDATE users SET blocked = 0"

try:
    # ejecutar el comando SQL
    cursor.execute(sql)
    # confirmar cambios en la base de datos
    db.commit()
except:
    # revertir cambios en caso de error
    print("Error al ejecutar el comando SQL")


