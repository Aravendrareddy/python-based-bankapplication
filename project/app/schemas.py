from pydantic import BaseModel
from typing import Optional

class AccountBase(BaseModel):
    account_number: str
    account_holder: str
    balance: Optional[float] = 0.0

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int

    class Config:
        from_attributes = True

class Transaction(BaseModel):
    amount: float