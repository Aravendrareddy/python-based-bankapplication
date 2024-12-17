import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

export const validateAccount = [
  body('accountNumber').notEmpty().withMessage('Account number is required'),
  body('accountHolder').notEmpty().withMessage('Account holder name is required'),
  body('balance').optional().isNumeric().withMessage('Balance must be a number'),
  validateResults
];

export const validateTransaction = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  validateResults
];

function validateResults(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}