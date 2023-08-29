export interface PaymentMethod {
    name: string;
    iconClass?: string;
    cod: string;
    iconImage?: any;
    text?: string;
}

export interface PaymentParams{ 
    buy_order: String;
    session_id: String;
    amount: Number;
    return_url: String;
}

export interface TransBankToken{
    token: String;
    url: String;
}