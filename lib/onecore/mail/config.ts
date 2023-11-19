import {EmailData} from './model/EmailData';
import {MailData} from './model/MailData';

export interface MailConfig {
  provider?: string;
  from: EmailData;
  key: string;
  smtp?: SmtpConfig;
}
export interface Address {
  name: string;
  address: string;
}
export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: Auth;
}
export interface Auth {
  user: string;
  pass: string;
}
export type Send = (mailData: MailData) => Promise<boolean>;
export type SendMail = Send;
export interface MailService {
  send(mailData: MailData): Promise<boolean>;
}
