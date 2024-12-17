import Account from '../models/Account.js';
import { createError } from '../utils/errors.js';

export const createAccount = async (req, res, next) => {
  try {
    const { accountNumber, accountHolder, balance = 0 } = req.body;
    const account = await Account.create({
      accountNumber,
      accountHolder,
      balance
    });
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ accountNumber: req.params.accountNumber });
    if (!account) {
      throw createError(404, 'Account not found');
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
};

export const deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      throw createError(400, 'Deposit amount must be positive');
    }

    const account = await Account.findOne({ accountNumber: req.params.accountNumber });
    if (!account) {
      throw createError(404, 'Account not found');
    }

    account.balance += amount;
    await account.save();
    res.json(account);
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      throw createError(400, 'Withdrawal amount must be positive');
    }

    const account = await Account.findOne({ accountNumber: req.params.accountNumber });
    if (!account) {
      throw createError(404, 'Account not found');
    }

    if (account.balance < amount) {
      throw createError(400, 'Insufficient funds');
    }

    account.balance -= amount;
    await account.save();
    res.json(account);
  } catch (error) {
    next(error);
  }
};