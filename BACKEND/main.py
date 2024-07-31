from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.transaction_type import transaction_type_router
from routers.transaction import transaction_router
from middlewares.error_handler import ErrorHandler
from config.database import engine, Base

Base.metadata.create_all(bind=engine)

from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()
app.title = "Money Tracker API"
app.description = "API ejemplo"
app.version = "0.1.0"



# origins = os.getenv("ORIGINS", "").split(",")
origins = [
    "http://localhost:5173",  # Agrega otros orígenes si es necesario
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ErrorHandler)

app.include_router(transaction_type_router)
app.include_router(transaction_router)

# @app.get("/", tags=["home"])
# def home():
#     return HTMLResponse(content = "<h1>Mi App</h1>")

# @app.get("/inyect", tags=["home"])
# def inyect():
#     import os
#     import json 
#     import requests
#     from datetime import datetime
#     from config.database import Session
#     from models.transaction import Transaction

#     url = "http://127.0.0.1:8000/"
#     data_path = os.path.join(os.path.dirname(__file__), "data", "MOCK_DATA.json")

#     with open(data_path, "r") as file:
#         data = json.load(file)
#         db = Session()

#         for transaction in data:
#             try:
#                 if 'date' in transaction:
#                     print(transaction['date'])
#                     transaction['date'] = datetime.strptime(transaction['date'], '%Y-%m-%dT%H:%M:%SZ')
#                 new_transaction = Transaction(**transaction)
#                 db.add(new_transaction)
#             except Exception as e:
#                 print(f"Error with transaction: {transaction}")
#                 print(e)
#         db.commit()
#         db.close()    

Base.metadata.create_all(bind=engine)