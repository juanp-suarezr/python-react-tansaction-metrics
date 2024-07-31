import os
# motor bd
from sqlalchemy import create_engine
#conexion con motor de bd (driver)
from sqlalchemy.orm.session import sessionmaker
#
from sqlalchemy.ext.declarative import declarative_base

sqlite_file_name = "database.sqlite"
#ruta directorio (ruta archivo especifico)
base_dir = os.path.dirname(os.path.realpath(__file__))
path_file_database = os.path.join(base_dir, '..', sqlite_file_name)
#url conexion -- cadena de caracter con formato --> f""
database_url = f"sqlite:///{path_file_database}"
# crear el motor -- echo=true --> mostrar todo lo que se ejecuta el sql. 
# por deafault y recomendable false
engine = create_engine(database_url, echo=True)
#para acoplar con motor
Session = sessionmaker(bind=engine)

Base = declarative_base()