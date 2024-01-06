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
from urllib.parse import parse_qs

# Información de la base de datos
rds_host = "3.211.29.216"
username = "admin"
password = "password"
dbname = "Twitter"

def lambda_handler(event , context):
    
    userId = "err"
    
    if(event == None):
        res = False
        msg = "Error: No se ha enviado ningún evento"
    else:
        body = eval(event["body"])
    
        # Comprobamos que se han enviado los parámetros necesarios
        if(body == None):
            res = False
            msg = "Error: No se ha enviado el body"
        else:
            keys = ["user", "passwordUser"]
        
            if(not all (key in body for key in keys)):
                res = False
                msg = "Faltan parametros para incializar al usuario"
            else:
                # Obtenemos los parámetros
                user = body["user"]
                passwordUser = body["passwordUser"]
               
                if(user == "" or passwordUser == ""):
                    res = False
                    msg = "Rellena todos los campos"
                else:
                    conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)
                
                    # Comprobamos que el usuario no existe (si existe, no se puede registrar)
                    
                    with conn.cursor() as cur:
                        cur.execute("SELECT * FROM UserTwitter WHERE userName = %s", (user))
                        detect = cur.fetchone()
                        conn.commit()
                    
                        if(detect != None):
                            res = False
                            msg = "Error: El usuario ya existe"
                        else:
                            # Creamos el usuario
                            
                            # Obtenemos la id del usuario
                            cur.execute("SELECT MAX(userId) FROM UserTwitter")
                            userId = cur.fetchone()[0] + 1
                            conn.commit()
                
                            # Generamos el hash de la contraseña
                            userPassword = crypt.crypt(passwordUser, 'salt')
                            
                           # Generamos el ssid
                            userSSID = str(uuid.uuid4())
                
                            # Generamos el createSSID
                            createSSID = date.today()
                
                            # Generamos el expireSSID
                            expiratedSSID = str( createSSID + timedelta(days=3))
                            expiratedSSID = expiratedSSID.split(' ')[0]
                
                            # Creamos el usuario en la base de datos
                            cur.execute("INSERT INTO UserTwitter(userId, userName, userPassword, avatar, failedAttempts, userBlocked, userSSID, createSSID, expiratedSSID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (userId, user, userPassword, "{}"  ,0 ,0 ,userSSID, createSSID, expiratedSSID))
                            conn.commit()
    
                            res = True
                            msg = "Usuario creado correctamente"

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg , 'userId':userId})
    }

