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
        
    try:

        # Conectamos con la base de datos
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=dbname, connect_timeout=10, port=3306)

        with conn.cursor() as cur:
            
            # Obtenemos todos los tweets de la base de datos
            cur.execute("SELECT id, userId, date, attachment, tweet FROM tweets")
            tweets_lineas = cur.fetchall()
        
            # Creamos un array para guardar los tweets
            tweets = []

            # Recorremos todos los tweets

            for tweet in tweets_lineas:
                id = tweet[0]
                
                # Obtenemos el nombre del usuario que ha escrito el tweet
                userId = tweet[1]
                cur.execute("SELECT name FROM users WHERE id = %s", (userId))
                author = cur.fetchone()[0]

                date = tweet[2].strftime("%d/%m/%Y %H:%M:%S")
                attachment = tweet[3]
                tweet = tweet[4]
                
                tweet_object = {
                    'id': id,
                    'author': author,
                    'date': date,
                    'attachment': attachment,
                    'tweet': tweet
                }

                tweets.append(tweet_object)

            cur.close();

    except pymysql.MySQLError as e:    
        print(e)
    
    # Cerramos la conexión con la base de datos
    conn.close();

    # Devolvemos el ssid y el userId
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin' : '*' },
        'body' : json.dumps( { 'tweets': tweets})
    }

