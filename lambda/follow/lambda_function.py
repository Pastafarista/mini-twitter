# Authors: Antonio Cabrera y Alejandro Gómez

import pymysql
import json
import uuid
from datetime import date
from datetime import timedelta

# Información de la base de datos
rds_host = "3.211.29.216"
username = "admin"
password = "password"
dbname = "twitter"

def lambda_handler(event , context):
    
    if(event == None):
        return {
            'statusCode': 200,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : json.dumps("Error: No se ha enviado ningún evento")
        }
    
    body = eval(event["body"])

    keys = ["user", "followUser"]
    
    if not all(key in body for key in keys):
        return {
            'statusCode': 200,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : json.dumps("Error: No se han enviado todos los parámetros")
        }

    user = body["user"]
    followUser = body["followUser"]
        
    try:
        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
                        
            # Comprobamos si los usuarios existen y si están bloqueados

            # Comprobamos si el usuario existe
            sql = "SELECT COUNT(*) FROM users WHERE username = %s"

            cur.execute(sql, (user))
            res = cur.fetchone()[0]

            if(res == 0):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario no existe")
                }

            # Comprobamos si el usuario está bloqueado
            sql = "SELECT blocked FROM users WHERE username = %s"

            cur.execute(sql, (user))
            blocked = cur.fetchone()[0]

            if(blocked == 1):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario está bloqueado")
                }

            # Comprobamos si el usuario al que se quiere seguir existe
            sql = "SELECT COUNT(*) FROM users WHERE username = %s"
            cur.execute(sql, (followUser))
            res = cur.fetchone()[0]

            if(res == 0):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario al que se quiere seguir no existe")
                }

            # Comprobamos si el usuario al que se quiere seguir está bloqueado
            sql = "SELECT blocked FROM users WHERE username = %s"

            cur.execute(sql, (followUser))

            blocked = cur.fetchone()[0]

            if(blocked == 1):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario al que se quiere seguir está bloqueado")
                }

            # Comprobamos si el usuario ya sigue al usuario al que se quiere seguir
            sql = "SELECT id FROM users WHERE username = %s"
            cur.execute(sql, (user))
            userId = cur.fetchone()[0]

            cur.execute(sql, (followUser))
            followedId = cur.fetchone()[0]

            sql = "SELECT COUNT(*) FROM followers WHERE userId = %s AND followerId = %s"
            cur.execute(sql, (userId, followedId))
            res = cur.fetchone()[0]
            if(res == 1):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario ya sigue al usuario al que se quiere seguir")
                }

            # comprobamos que el usuario no se siga a si mismo
            if(userId == followedId):
                return {
                    'statusCode': 200,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : json.dumps("Error: El usuario no se puede seguir a si mismo")
                }

            # Seguimos al usuario
            sql = "INSERT INTO followers(userId, followerId) VALUES (%s, %s)"
            cur.execute(sql, (userId, followedId))
            conn.commit()
            cur.close();
    except pymysql.MySQLError as e:    
        print(e)

        return {
            'statusCode': 200,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : json.dumps("Error: No se ha podido seguir al usuario -> " + str(e))
        }
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps("El usuario ahora sigue al usuario al que se quiere seguir")
    }

