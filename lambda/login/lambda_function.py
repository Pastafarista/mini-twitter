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
dbname = "Twitter"

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
    res="true"
    avatar="err"
    
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
            detected = cur.execute("select userId, avatar from UserTwitter where userName='" +user+ "' and userPassword='"+ hashPasswordUser+"'");
            rows = cur.fetchall()
            
            # Si existe, generamos un ssid y lo guardamos en la base de datos
            if detected != 0:
                userId = rows[0][0]
                avatar = rows[0][1]
                res = "true"
                msg = "Logged!"
                ssid = uuid.uuid4()
                ssid = str(ssid)
                
                today = date.today()
                exdate = str( today + timedelta(days=3))
                exdate = exdate.split(' ')[0]
                
                cur.execute("UPDATE UserTwitter SET userSSID='" + ssid + "' , createSSID='" + str(today) + "' , expiratedSSID='" + exdate + "' WHERE userId ='" + str(userId) + "'");
                conn.commit();
                
                cur.close();
            else:
                res = "false"
                msg = "Password or UserName Incorrect"
            
            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg ,'user':user, 'ssid':ssid, 'userId':userId, 'avatar':avatar})
    }
