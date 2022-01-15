import { ethers } from 'ethers';
import crypto from 'crypto';

import localStorage from './localStorage';

const createWallet = () => {
  const id = crypto.randomBytes(32).toString('hex');
  const privateKey = `0x${id}`;
  localStorage.write('privateKey', privateKey);
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
};

const getAddress = () => {
  const privateKey = localStorage.read('privateKey', undefined);
  if (!privateKey) return undefined;
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
};

export default {
  getAddress,
  createWallet,
};
