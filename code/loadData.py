import numpy as np
import os
import pandas as pd
import time
import mysql.connector
activity_logs_72 ={}
table_name = "TravelJournal"
file_path = f"Data_Visualization_Project/Data/Journals/{table_name}.csv"
start_time = time.time()
connection = mysql.connector.connect(host='localhost',username='root',password='',database='')
cursor = connection.cursor()

df = (pd.read_csv(file_path)).to_numpy()

for row in df:
    insert_query = f"INSERT INTO {table_name} (participantId,travelStartTime,travelStartLocationId,travelEndTime,travelEndLocationId,purpose,checkInTime,checkOutTime,startingBalance,endingBalance) VALUES (%s, %s, %s,%s, %s, %s,%s, %s, %s,%s)"
    data = (row[0], row[1], row[2],row[3], row[4], row[5],row[6], row[7], row[8],row[9])
    try:
        cursor.execute(insert_query, data)
    except:
        data = (row[0], row[1], -1,row[3], row[4], row[5],row[6], row[7], row[8],row[9])
        cursor.execute(insert_query, data)
    connection.commit()
connection.close()


