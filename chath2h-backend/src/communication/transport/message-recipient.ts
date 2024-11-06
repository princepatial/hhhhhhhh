export class MessageRecipient {
    private recipient: string[] = [];
    public add(recipient: string) : MessageRecipient {
        this.recipient.push(recipient)
        return this;
    }

    public addWithSocket(recipient: string, socket: string) : MessageRecipient{
        this.recipient.push(recipient+socket);
        return this;
    }

    public build() : string | string[] {
        if(this.recipient.length == 1){
            return this.recipient[0];
        } else {
            return this.recipient;
        }
    }

}