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
    keyWord="err"
    msg="err"
    res=True
    blocked="err"
    newpassWord="err"
    
    user = body["user"];
    keyWord = body["keyword"]; 
    newpassWord = body["newPassword"];
        
    try:
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            detected = cur.execute("select blocked from users where username ='" + user + "' and keyword='" + keyWord + "'");
            rows = cur.fetchall()
            
            if detected != 0:
                blocked = rows[0][0]
                
                if blocked == True:
                    res = False
                    msg = "La cuenta está bloqueada"
                else:
                    newpassWordhash = crypt.crypt(newpassWord, 'salt')
                    cur.execute("UPDATE users SET password ='" + newpassWordhash + "' WHERE username ='" + user + "'")
                    conn.commit()
                    
                    res = True
                    msg = "Contraseña cambiada correctamente"
            else:
                res = False
                msg = "Usuario o palabra clave incorrectos"
            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    conn.close();

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg , 'password':newpassWord})
    }
