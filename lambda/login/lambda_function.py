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

    user="err"
    passwordUser="err"
    ssid="err"
    userId="err"
    msg="err"
    res=True
    avatar="err"
    blocked="err"
    
    # Recogemos los datos del body
    user = body["user"];
    passwordUser = body["passwordUser"]; 
        
    try:
        # Encriptamos la contraseña para compararla con la de la base de datos
        hashPasswordUser = crypt.crypt(passwordUser,'salt')

        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:

            # Comprobamos si existe el usuario en la base de datos
            detected = cur.execute("select id, avatar, blocked from users where name ='" + user + "' and password='" + hashPasswordUser + "'");
            rows = cur.fetchall()
            
            # Si existe, generamos un ssid y lo guardamos en la base de datos
            if detected != 0:
                userId = rows[0][0]
                blocked = rows[0][2]
                
                if(blocked == True):
                    res = False
                    msg = "The account is blocked"
                else:
                    res = True
                    msg = "Logged!"
                    avatar = rows[0][1]
                    ssid = uuid.uuid4()
                    ssid = str(ssid)
                    today = date.today()
                    exdate = str( today + timedelta(days=3))
                    exdate = exdate.split(' ')[0]
                    
                    cur.execute("UPDATE users SET failedAttempts=0 ,userSSID='" + ssid + "' , createSSID='" + str(today) + "' , expiratedSSID='" + exdate + "' WHERE id ='" + str(userId) + "'");
                
                conn.commit();
                cur.close();
            else:
                res = False
                msg = "Password or UserName Incorrect"

                # Si existe el usuario añadimos un intento fallido
                detected = cur.execute("SELECT id, failedAttempts, blocked FROM users WHERE name='" + user + "'");
                rows = cur.fetchall()

                if detected != 0:
                    userId = rows[0][0]
                    failedAttempts = rows[0][1]
                    userBlocked = rows[0][2]
                    
                    if userBlocked == True:
                        msg = "The account is blocked"
                    elif failedAttempts < 2:
                        cur.execute("UPDATE users SET failedAttempts = failedAttempts + 1 WHERE id='" + str(userId) + "'");
                        msg = "Password or UserName Incorrect. Failed Attempts: " + str(failedAttempts + 1)
                        conn.commit();
                    else:
                        # Si el usuario ha fallado 3 veces, bloqueamos la cuenta
                        msg = "Password or UserName Incorrect. Failed Attempts: " + str(failedAttempts + 1) + ". Account Blocked"
                        cur.execute("UPDATE users SET blocked = true WHERE id ='" + str(userId) + "'");
                        cur.execute("UPDATE users SET failedAttempts=0 WHERE id = '" + str(userId) + "'")
                        conn.commit();
            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg , 'user':user, 'ssid':ssid, 'userId':userId, 'userBlocked':blocked ,'avatar':avatar})
    }
