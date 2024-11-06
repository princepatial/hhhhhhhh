import { getGlobalState } from 'globalState';
import { User } from 'globalTypes';
import { erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';

const getAllowance = (user: User | null) => {
  const h2hToken = getGlobalState('h2hToken');

  const allowance = useContractRead({
    address: h2hToken?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [user?.walletAddress as `0x${string}`, h2hToken?.adminWalletAddress as `0x${string}`]
  });
  return allowance;
};

export const getContractApprove = () => {
  const h2hToken = getGlobalState('h2hToken');

  const { config } = usePrepareContractWrite({
    address: h2hToken?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      h2hToken?.adminWalletAddress as `0x${string}`,
      BigInt(h2hToken ? h2hToken.startingAmount : '')
    ]
  });

  return useContractWrite(config);
};

export const askForApproval = (user: User | null) => {
  const h2hToken = getGlobalState('h2hToken');
  const allowance = getAllowance(user);

  return h2hToken && (allowance?.data || 0) < BigInt(h2hToken.startingAmount);
};
