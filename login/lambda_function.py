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
rds_host = "3.211.121.243"
username = "admin"
password = "password"
dbname = "Twitter"

def lambda_handler(event , context):
    body = json.dumps(event["body"])
    
    user="err"
    passwordUser="err"
    ssid="err"
    userId="err"
    msg="err"
    res="true"
    avatar="err"
    
    if "isBase64Encoded" in event:
        isEncoded = bool(event["isBase64Encoded"]);
        if isEncoded :
            decodedBytes = base64.b64decode(event["body"]);
            decodedStr = decodedBytes.decode("ascii") ;
            print(json.dumps(parse_qs(decodedStr)));
            decodedEvent = json.loads(json.dumps(parse_qs(decodedStr)));
            user = decodedEvent["user"][0];
            passwordUser = decodedEvent["passwordUser"][0];
    else:
        user = event["user"];
        passwordUser = event["passwordUser"]; 
        
    try:
        hashPasswordUser = crypt.crypt(passwordUser,'salt')
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)
        with conn.cursor() as cur:
            detected = cur.execute("select userId, avatar from UserTwitter where userName='" +user+ "' and userPassword='"+ hashPasswordUser+"'");
            rows = cur.fetchall()
            
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
    
    conn.close();

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'res':res , 'msg':msg ,'user':user, 'ssid':ssid, 'userId':userId, 'avatar':avatar})
    }

