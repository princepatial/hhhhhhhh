import { IsPositive } from "class-validator";

export default class TokenTransactionInfo {
    public constructor(init?: Partial<TokenTransactionInfo>) {
        Object.assign(this, init);
    }
    @IsPositive()
    tokensToCoach: number
    @IsPositive()
    fee: number;
    @IsPositive()
    onChainFee: number;
    @IsPositive()
    onChainTokensFromUserToCoach: number;
    @IsPositive()
    onChainTokensFromAdminToCoach: number;

}