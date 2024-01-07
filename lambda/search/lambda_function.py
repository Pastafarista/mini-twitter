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

   
    # Recogemos los datos del body
    user = body["user"];

    # Creamos un array para guardar los usuarios
    usuarios = []

    try:
        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            
            # Buscamos los usuarios que coincidan con el nombre de usuario
            sql = "SELECT id, name, avatar FROM users WHERE username = %s"
            cur.execute(sql, (user))
            res = cur.fetchall()


            # Recorremos los usuarios
            for row in res:
                usuario = {
                    'id': row[0],
                    'name': row[1],
                    'avatar': row[2]
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
