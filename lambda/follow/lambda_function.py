# Authors: Antonio Cabrera y Alejandro Gómez

import pymysql
import json

# Información de la base de datos
rds_host = "3.211.29.216"
username = "admin"
password = "password"
dbname = "twitter"

def lambda_handler(event , context):
    
    if(event == None):
        return {
            'statusCode': 400,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : "Error: No se ha enviado ningún evento"
        }
    
    body = eval(event["body"])

    keys = ["search", "onlyFollowers"]

    if(not all (key in body for key in keys)):
        return {
            'statusCode': 200,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : "Error: No se han enviado todos los parámetros"
        }
   
    # Recogemos los datos del body
    user = body["search"];
    onlyFollowers = body["onlyFollowers"];

    # Creamos un array para guardar los usuarios
    usuarios = []

    try:
        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            
            # obtener las ids 
            sql = "SELECT id FROM users WHERE username = %s"
            cur.execute(sql, (user))
            userId = cur.fetchone()
            
            if(onlyFollowers == False):
                # Buscamos los usuarios que coincidan con el nombre de usuario
                sql = "SELECT id, name, username, avatar FROM users WHERE username LIKE %s"
                cur.execute(sql, ('%' + user + '%'))
                res = cur.fetchall()
            else:
                # Buscamos los usuarios que coincidan con el nombre de usuario
                sql = "SELECT id, name, username, avatar FROM users WHERE username LIKE %s AND id IN (SELECT userId FROM followers WHERE followerId = %s)"
                cur.execute(sql, ('%' + user + '%', userId))
                res = cur.fetchall()

            # Recorremos los usuarios
            for row in res:
                usuario = {
                    'id': row[0],
                    'name': row[1],
                    'username':row[2],
                    'avatar': row[3]
                }

                usuarios.append(usuario) 

            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'usuarios' : usuarios })
    }

