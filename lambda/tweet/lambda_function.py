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
    
    # Inicializamos las variables de respuesta
    res = "err"
    msg = "err"

    # Recogemos los datos del body
    body = eval(event["body"])
    name = body["user"];
    tweet = body["tweet"];
    attachment = body["attachment"];
        
    try:
        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            # Comprobamos si existe el usuario en la base de datos
            detected = cur.execute("SELECT id FROM users WHERE name='" + name + "'");

            if not detected:
                res = False
                msg = "El usuario no existe"
            elif tweet == "":
                res = False
                msg = "El tweet esta vacio"
            elif len(tweet) > 200:
                res = False
                msg = "El tweet execede los 200 caracteres"
            
            else:
                rows = cur.fetchall()
                
                userId = str(rows[0][0])
                
                # Si existe, creamos el tweet
                date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                   
                if(attachment == ""):
                    cur.execute("INSERT INTO tweets (userId, tweet, date) VALUES ('" + userId + "', '" + tweet + "', '" + date + "')");
                else:
                    cur.execute("INSERT INTO tweets (userId, tweet, date, attachment) VALUES ('" + userId + "', '" + tweet + "', '" + date + "', '" + attachment + "')");
                conn.commit();

                res = True
                msg = "Tweet creado correctamente"

        cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg })
    }

