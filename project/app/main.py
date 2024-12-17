from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database
from .database import engine, SessionLocal
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Banking API")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/accounts/", response_model=schemas.Account)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = models.Account(
        account_number=account.account_number,
        account_holder=account.account_holder,
        balance=account.balance or 0.0
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@app.get("/api/accounts/{account_number}", response_model=schemas.Account)
def get_account(account_number: str, db: Session = Depends(get_db)):
    db_account = db.query(models.Account).filter(models.Account.account_number == account_number).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@app.post("/api/accounts/{account_number}/deposit", response_model=schemas.Account)
def deposit(account_number: str, transaction: schemas.Transaction, db: Session = Depends(get_db)):
    db_account = db.query(models.Account).filter(models.Account.account_number == account_number).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")
    
    db_account.balance += transaction.amount
    db.commit()
    db.refresh(db_account)
    return db_account

@app.post("/api/accounts/{account_number}/withdraw", response_model=schemas.Account)
def withdraw(account_number: str, transaction: schemas.Transaction, db: Session = Depends(get_db)):
    db_account = db.query(models.Account).filter(models.Account.account_number == account_number).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Withdrawal amount must be positive")
    if db_account.balance < transaction.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    db_account.balance -= transaction.amount
    db.commit()
    db.refresh(db_account)
    return db_account