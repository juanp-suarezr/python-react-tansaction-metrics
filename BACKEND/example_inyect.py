import os
import json 
import requests
from datetime import datetime
from config.database import Session
from models.transaction import Transaction

url = "http://127.0.0.1:8000/"
data_path = os.path.join(os.path.dirname(__file__), "data", "MOCK_DATA.json")

with open(data_path, "r") as file:
    data = json.load(file)
    db = Session()

    for transaction in data:
        try:
            if 'date' in transaction:
                print(transaction['date'])
                transaction['date'] = datetime.strptime(transaction['date'], '%Y-%m-%dT%H:%M:%SZ')
            new_transaction = Transaction(**transaction)
            db.add(new_transaction)
        except Exception as e:
            print(f"Error with transaction: {transaction}")
            print(e)
    db.commit()
    db.close()        