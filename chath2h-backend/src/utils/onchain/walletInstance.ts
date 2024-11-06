
import { Contract, JsonRpcProvider, NonceManager, Wallet, parseEther } from 'ethers';
import { Settings } from '../../settings';
import { erc20ABI } from './ERC20abi';

export class WalletInstance {
  private wallet: NonceManager;
  private provider: JsonRpcProvider;
  private contract: Contract;

  constructor(
    private privateKey = Settings.H2H_TOKEN_ADMIN_PRIVATE_KEY ?? ''
  ) {
    if (!privateKey) throw 'Missing wallet key - failed to initialize wallet';

    this.provider = new JsonRpcProvider(Settings.RPC_PROVIDER);

    const wallet = new Wallet(
      this.privateKey,
      this.provider,
    );
    this.wallet = new NonceManager(wallet);

    this.contract = new Contract(Settings.H2H_TOKEN_ADDRESS, erc20ABI, this.wallet);
  }

  public async transferFrom(
    walletFrom: string,
    walletTo: string,
    amount: number,
  ) {
    if (!this.contract) throw 'Contract instance doesnt exist';

    const feeData = await this.provider.getFeeData();
    const isFromAppWallet = await this.isFromAppWallet(walletFrom);
    try {
      let tx = null;
      if(isFromAppWallet){
        tx = await this.contract['transfer'].apply(null, [
          walletTo,
          parseEther(amount.toString()),
          { from: await this.wallet.getAddress(), gasPrice: feeData.gasPrice },
        ]);
      } else {
        tx = await this.contract['transferFrom'].apply(null, [
          walletFrom,
          walletTo,
          parseEther(amount.toString()),
          { from: await this.wallet.getAddress(), gasPrice: feeData.gasPrice },
        ]);
      }

      return tx['wait'] ? await tx.wait() : tx;
    }
    catch (error) {
      console.error(
        'Error occured during transferFrom: ' +
        error,
      );
    }
  }

  public async willTransferFromPass(
    walletFrom: string,
    walletTo: string,
    amount: number,
  ) {
    if (!this.contract) throw 'Contract instance doesnt exist';
    let result = true;

    const isFromAppWallet = await this.isFromAppWallet(walletFrom);

    try {
      if(isFromAppWallet){
        await this.contract['transfer'].staticCall(
          walletTo,
          amount
        );
      } else {
        await this.contract['transferFrom'].staticCall(
          walletFrom,
          walletTo,
          amount
        );
      }
    }
    catch (error) {
      console.error(
        'Error occured during transferFrom static call test:' +
        error,
      );

      result = false;
    }
    finally {
      console.log('Will transfer be complete:', result);
      return result;
    }
  }

  private async isFromAppWallet(address : string) : Promise<boolean>{
    return address === (await this.wallet.getAddress());
  }

}