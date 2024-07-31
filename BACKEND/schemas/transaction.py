from typing import Optional
from pydantic import BaseModel, Field, field_validator
import datetime

class Transaction(BaseModel):
    id: Optional[int] = None
    type_id: int = Field(ge=1)
    account: str = Field(min_length=6, max_length=30)
    category: str = Field(min_length=5, max_length=40)
    description: str = Field(max_length=250)
    quantity: int = Field(ge = 0)
    date: Optional[datetime.datetime] = Field(default=datetime.datetime.now(datetime.UTC))

class TransactionFilter(BaseModel):
    limit: int = Field(ge=1, le=100)
    offset: int = Field(ge=0)
    account: Optional[str] = None
    category: Optional[str] = None
    type_id: Optional[int] = None
    start_date: Optional[datetime.datetime] = None
    end_date: Optional[datetime.datetime] = None

    # @field_validator("date")
    # @classmethod
    # def check_is_tomorrow(cls, date: date) -> date:
    #     today = date.today()
    #     eighteen_years_ago = date(today.year - 18, today.month, today.day)

    #     if date_of_birth > eighteen_years_ago:
    #         raise ValueError("Employees must be at least 18 years old.")

    #     return date_of_birth