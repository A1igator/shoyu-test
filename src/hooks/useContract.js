import { ethers } from 'ethers';
import { useMemo } from 'react';
import SushiRollABI from '../ABIs/SushiRollABI';
import UniPosABI from '../ABIs/UniPosABI';
import useSignerContext from './useSignerContext';

export function useContract(address, ABI) {
  const { signer } = useSignerContext();

  return useMemo(
    () => {
      if (!(address && ABI && signer)) return undefined;
      return new ethers.Contract(address, ABI, signer);
    },
    [address, ABI, signer],
  );
}

export function useUniPosContract(address) {
  const { signer } = useSignerContext();
  return useContract(address, UniPosABI, signer);
}

export function useSushiRollContract() {
  const { signer } = useSignerContext();
  return useContract('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', SushiRollABI, signer);
}
