import sys
import logging
import pymysql
import json
import base64
from urllib.parse import parse_qs

rds_host = "123.456.789"

username = "admin"
password ="password"
dbname = "calculadora"

bucketUrl = "https://prueba.s3.us-east-1.amazonaws.com/"

def lambda_handler(event , context):
    print(json.dumps(event));
    
    user="err";
    comment="err";
    attachment="err";
    if "isBase64Encoded" in event:
        isEncoded=bool(event["isBase64Encoded"]);
    
        if isEncoded :
            decodedBytes = base64.b64decode(event["body"]);
            decodedStr = decodedBytes.decode("ascii") ;
            print(json.dumps(parse_qs(decodedStr)));
            decodedEvent=json.loads(json.dumps(parse_qs(decodedStr)));
            user=decodedEvent["user"][0];
            comment=decodedEvent["comment"][0];
            attachment=decodedEvent["attachment"][0];

    else:
        user=event["body"]["user"];
        comment=event["body"]["comment"];
        attachment=event["body"]["attachment"];
        
    print(user);
  
    try:
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)
        print(1);
        with conn.cursor() as cur:
            cur.execute("insert into posts values('"+user+"','"+comment+"','"+attachment+"')");
            print(2);
            conn.commit();
            print(3);
            cur.close();
    except pymysql.MySQLError as e:    
        print (e)
    conn.close();
    print(4);
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : 'OK'    }
