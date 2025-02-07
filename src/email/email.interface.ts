export interface Attachments{
    filename: string;
    content: string; 
    encoding:string;
    contentDisposition?: 'attachment' | 'inline' | undefined;
}
export interface RawEmail {
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    html: string;
    attachments?: Attachments[]
}