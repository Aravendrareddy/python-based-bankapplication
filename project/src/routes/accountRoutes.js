import express from 'express';
import { validateAccount, validateTransaction } from '../middleware/validators.js';
import {
  createAccount,
  getAccount,
  deposit,
  withdraw
} from '../controllers/accountController.js';

const router = express.Router();

router.post('/', validateAccount, createAccount);
router.get('/:accountNumber', getAccount);
router.post('/:accountNumber/deposit', validateTransaction, deposit);
router.post('/:accountNumber/withdraw', validateTransaction, withdraw);

export default router;