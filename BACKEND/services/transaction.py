from datetime import datetime
from sqlalchemy import func
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import NoResultFound
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# esquemas
from schemas.transaction import Transaction
# from schemas.transaction import TransactionFilter
# modelos
from models.transaction_type import TransactionType as TransactionTypeModel
from models.transaction import Transaction as TransactionModel
#config
from config.database import Session


class TransactionService:
    def __init__(self):
        self.db = Session()

    def create(self, transaction_data: Transaction):
        try:
            self._check_resource_existence(
                TransactionTypeModel,
                transaction_data.type_id,
                "Transaction type"
            )
            new_transaction = TransactionModel(**transaction_data.model_dump())
            self.db.add(new_transaction)
            self.db.commit()
            return JSONResponse(
                content=jsonable_encoder(new_transaction),
                status_code=201
            )
        except:
            raise HTTPException(
                status_code=404,
                detail=f"Transaction type not found"
            )

    def update(self, transaction_id: int, transaction_data: Transaction):
        try:
            self._check_resource_existence(
                TransactionModel,
                transaction_id,
                "Transaction"
            )
            self._check_resource_existence(
                TransactionTypeModel,
                transaction_data.type_id,
                "Transaction type"
            )
            self.db.query(TransactionModel).filter(TransactionModel.id == transaction_id).update(
                transaction_data.model_dump()
            )
            self.db.commit()
            return JSONResponse(
                content=jsonable_encoder(transaction_data),
                status_code=200
            )
        except:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found"
            )

    def get_all(self):
        transactions = self.db.query(TransactionModel).options(
            joinedload(TransactionModel.type),
        ).all()
        return JSONResponse(
            content=jsonable_encoder(transactions),
            status_code=200
        )

    def get_some(self, limit: int, offset: int, account: str):
        query = self.db.query(TransactionModel).options(
        joinedload(TransactionModel.type),
        )
        if account:
            print(f"account ${account}")
            query = query.filter(
                or_(
                    TransactionModel.account.ilike(f"%{account}%")
                )
            )

        transactions = query.limit(limit).offset(offset).all()
        return JSONResponse(
            content=jsonable_encoder(transactions),
            status_code=200
        )

    def get_by_id(self, transaction_id: int):
        transaction = self.db.query(TransactionModel).options(
            joinedload(TransactionModel.type),
        ).filter(TransactionModel.id == transaction_id).first()
        if not transaction:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found"
            )
        return JSONResponse(
            content=jsonable_encoder(transaction),
            status_code=200
        )

    def get_unique_accounts(self):
        accounts = self.db.query(TransactionModel.account).distinct().all()
        print(accounts)
        return JSONResponse(
            content=jsonable_encoder([account[0] for account in accounts]),
            status_code=200
        )

    def get_unique_categories(self):
        categories = self.db.query(TransactionModel.category).options(
            joinedload(TransactionModel.type),
        ).distinct().all()
        return JSONResponse(
            content=jsonable_encoder(categories),
            status_code=200
        )

        #ejemplo
        def get_summary_total_amount_by_type(self):
            total_amount_by_tipo = self.db.query(
                func.sum(TransactionModel.quantity).label('total_amount'),
                TransactionTypeModel.name
            ).join(
            TransactionTypeModel,
            TransactionModel.type_id == TransactionTypeModel.id
            ).group_by(
            TransactionTypeModel.name
            ).all()
        
            return JSONResponse(
            content=jsonable_encoder(categories),
            status_code=200
            )


        summary = [
            {
                "date": result.date,
                "type": result.name,
                "total_amount": result.total_amount
            } for result in transactions
        ] 
        #esto es una nueva forma de python de hacer eso -> ...
        #sumary = []
        #for result in transactions:
        #sumarry.append({
        #"date": result.date,
        #"type": result.name,
        #"total_amount": result.total_amount
        #})

        return JSONResponse(
            content=jsonable_encoder(summary),
            status_code=200
        )

    def get_summary_by_date_and_type(self, account: str):
        # Construye la consulta base
        query = self.db.query(
            func.date(TransactionModel.date).label('date'),
            TransactionTypeModel.name,
            func.sum(TransactionModel.quantity).label('total_amount')
        ).join(
            TransactionTypeModel,
            TransactionModel.type_id == TransactionTypeModel.id
        )

        # Aplica el filtro si se proporciona una cuenta
        if account:
            print(f"Filtering by account: {account}")
            query = query.filter(
            TransactionModel.account.ilike(f"%{account}%")
            )

        transactions = query.group_by(
            func.date(TransactionModel.date),
            TransactionTypeModel.name
        ).order_by(
            func.date(TransactionModel.date).desc()
        ).all()

        # Crear el resumen
        summary = [
            {
                "date": result.date,
                "type": result.name,
                "total_amount": result.total_amount
            } for result in transactions
        ]   

        return JSONResponse(
            content=jsonable_encoder(summary),
            status_code=200
        )

##scalar() -- es para traer un numero, el total de todo
    def get_summary_total_amount_by_type(self, account: str):
        try:
            # Crear la consulta base
            query = self.db.query(
                TransactionTypeModel.name,
                func.sum(TransactionModel.quantity).label('total_amount')
            ).join(
                TransactionModel
            )

            # Aplicar el filtro de cuenta si se proporciona
            if account:
                query = query.filter(TransactionModel.account.ilike(f"%{account}%"))

            # Agrupar por tipo de transacción
            transactions = query.group_by(TransactionTypeModel.name).all()

            # Calcular el total de las cantidades para calcular los porcentajes
            total_amount = sum(transaction.total_amount for transaction in transactions)

            # Crear el resumen
            summary = [
                {
                    "type": result.name,
                    "total_amount": result.total_amount,
                    "percentage": round((result.total_amount * 100) / total_amount, 2)
                } for result in transactions
            ]

            return JSONResponse(
                content=jsonable_encoder(summary),
                status_code=200
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
    
    def get_summary_avg_amount_monthly_by_type(self, account: str):
        try:
            # Construye la consulta base
            query = self.db.query(
                TransactionTypeModel.name,
                func.extract('year', TransactionModel.date).label('year'),
                func.extract('month', TransactionModel.date).label('month'),
                func.sum(TransactionModel.quantity).label('total_amount')
            ).join(
                TransactionTypeModel,
                TransactionModel.type_id == TransactionTypeModel.id
            )

            # Aplica el filtro si se proporciona una cuenta
            if account:
                print(f"Filtering by account: {account}")
                query = query.filter(
                TransactionModel.account.ilike(f"%{account}%")
                )

            # Obtener la suma de cantidades agrupadas por tipo y por mes
            monthly_sums = query.group_by(
                TransactionTypeModel.name,
                func.extract('year', TransactionModel.date),
                func.extract('month', TransactionModel.date)
            ).all()

            # Calcular el promedio mensual por tipo
            type_monthly_totals = {}
            for record in monthly_sums:
                type_name = record.name
                if type_name not in type_monthly_totals:
                    type_monthly_totals[type_name] = []
                    type_monthly_totals[type_name].append(record.total_amount)

            type_monthly_averages = [
                {
                    "type": type_name,
                    "average_monthly_amount": sum(amounts) / len(amounts)
                }
                for type_name, amounts in type_monthly_totals.items()
            ]

            return JSONResponse(
                content=jsonable_encoder(type_monthly_averages),
                status_code=200
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )


    def _check_resource_existence(self, model, resource_id, resource_name):
        if not resource_id:
            return
        try:
            all_ids = self.db.query(model).filter(
                model.id == resource_id).first()
            if not all_ids:
                raise NoResultFound
        except NoResultFound:
            raise HTTPException(
                status_code=404, detail=f"{resource_name} not found")