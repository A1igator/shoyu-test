import { ethers } from 'ethers';
import { useMemo } from 'react';
import SushiRollABI from '../ABIs/SushiRollABI';
import UniPosABI from '../ABIs/UniPosABI';

export function useContract(address, ABI, signerOrProvider) {
  return useMemo(
    () => {
      if (!(address && ABI && signerOrProvider)) return undefined;
      return new ethers.Contract(address, ABI, signerOrProvider);
    },
    [address, ABI, signerOrProvider],
  );
}

export function useUniPosContract(address, signerOrProvider) {
  return useContract(address, UniPosABI, signerOrProvider);
}

export function useSushiRollContract(signerOrProvider) {
  return useContract('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', SushiRollABI, signerOrProvider);
}
