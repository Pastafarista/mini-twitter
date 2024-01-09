# Authors: Antonio Cabrera y Alejandro Gómez

import sys
import logging
import pymysql
import json
import base64
import uuid
import crypt
from datetime import date
from datetime import timedelta
from datetime import datetime
from urllib.parse import parse_qs

def lambda_handler(event , context):
    
    # Información de la base de datos
    rds_host = "3.211.29.216"
    username = "admin"
    password = "password"
    dbname = "twitter"
        
    if(event == None):
        return {
            'statusCode': 400,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : "Error: No se ha enviado ningún evento"
        }
    
    body = eval(event["body"])

    if(body == None):
        return {
            'statusCode': 400,
            'headers': { 'Access-Control-Allow-Origin' : '*' },
            'body' : "Error: No se ha enviado ningún body"
        }

    # Recogemos los datos del body
    user = body["username"]

    try:
        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            # Comprobamos si el usuario existe
            sql = "SELECT id, name, username, blocked, avatar FROM users WHERE username = %s"
            cur.execute(sql, (user))

            # Obtenemos el resultado de la consulta
            res = cur.fetchone()

            # Si el usuario no existe
            if(res == None):
                return {
                    'statusCode': 400,
                    'headers': { 'Access-Control-Allow-Origin' : '*' },
                    'body' : "Error: El usuario no existe"
                }

            # Obtenemos los datos del usuario
            userId = res[0]
            name = res[1]
            username = res[2]
            blocked = res[3]
            avatar = res[4] 

            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { "userId" : userId, "name" : name, "username" : username, "blocked" : blocked, "avatar" : avatar })
    }

