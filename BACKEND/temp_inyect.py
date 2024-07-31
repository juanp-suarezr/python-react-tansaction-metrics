import os
import json 
import requests
from config.database import Session
from models.transaction import Transaction

url = "http://127.0.0.1:8000/"
transactions_type = ["deposit", "withdraw", "interest"]

for transaction_type in transactions_type:
    response = requests.post(url + "transactions_types", json = {"name": transaction_type})
    print(response.json())