import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
} from '@nestjs/common';
import * as Imap from 'node-imap';
//import { MailParser, ParsedMail, simpleParser, Source } from 'mailparser';
import * as MailParser from 'mailparser';
import * as fs from 'fs';

@Injectable()
export class ImapService implements OnModuleDestroy {
  private imap: Imap;

  constructor() {
    console.log(String(process.env.EMAIL_USER));
    this.imap = new Imap({
      user: String(process.env.EMAIL_USERNAME),
      password: String(process.env.EMAIL_PASSWORD),
      host: process.env.IMAP_HOST,
      port: 993,
      tls: true,
    });

    this.imap.once('ready', () => {
      console.log('IMAP connection ready');
    });

    this.imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
    });

    this.imap.once('end', () => {
      console.log('IMAP connection ended');
    });
  }

  async openInbox(
    threadTopic: string,
    date: string,
    take: number = 10,
    skip: number = 0,
  ): Promise<{ emails: MailParser.ParsedMail[] }> {
    return new Promise((resolve, reject) => {
      if (this.imap.state === 'disconnected') {
        this.imap.connect();
      }
      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', true, async (err, box) => {
          if (err) {
            console.log(String(err));
            reject(err);
          }
          console.log(`Opened inbox: ${box.name}`);
          try {
            const emails = await this.fetchMail(threadTopic, date, take, skip);
            resolve({ emails });
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  }

  isSupportedAttachment(attachment: { filename: string }) {
    const supportedExtensions = [
      '.pdf',
      '.xlsx',
      '.jpg',
      '.zip',
      '.rar',
      '.docx',
    ];

    if (attachment.filename) {
      const extension = attachment.filename.toLowerCase().split('.').pop();
      return supportedExtensions.includes(`.${extension}`);
    }

    return false;
  }

  findAttachmentParts(struct: any, attachments: any[]) {
    attachments = attachments || [];
    for (let i = 0; i < struct.length; ++i) {
      if (Array.isArray(struct[i])) {
        this.findAttachmentParts(struct[i], attachments);
      } else {
        if (
          struct[i].disposition &&
          ['INLINE', 'ATTACHMENT'].indexOf(
            this.toUpper(struct[i].disposition.type),
          ) > -1
        ) {
          attachments.push(struct[i]);
        }
      }
    }
    return attachments;
  }

  toUpper(thing: string) {
    return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
  }

  async fetchMail(
    threadTopic: string,
    date: string,
    take: number = 10,
    skip: number = 0,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // const mid = '<6cc2ba4a-818d-98b2-3ab0-ff6fe9fc747a@gmail.com>';
      // const midyest = '<42a7fc3d-ae93-ac61-d6db-b14163245314@gmail.com>';
      //const threadTopic = "test forwarding";
      //const date = 'Dec 2, 2024'
      const searchCriteria = [
        ['HEADER', 'THREAD-TOPIC', threadTopic],
        ['ON', date],
      ];
      //const searchCriteria = [['HEADER', 'MESSAGE-ID', mid]];
      const fetchOptions: Imap.FetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        struct: true,
        markSeen: false,
      };

      this.imap.search(searchCriteria, async (err, results) => {
        if (err) {
          console.error('IMAP Search Error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          console.log('no mail found');
          return this.imap.end();
        }
        console.log('Fetched new emails:', results.length);
        if (results.length > take) {
          if (skip > 0) {
            results = results.splice(0, skip);
          }
          results.splice(take);
          console.log('after splice: ', results.length);
        }

        const emails = this.imap.fetch(results, fetchOptions);
        console.log('Emails content: ', emails);
        const emailArray: MailParser.ParsedMail[] = [];
        const emailPromises: Promise<MailParser.ParsedMail>[] = [];

        emails.on('message', (message) => {
          emailPromises.push(
            new Promise((resolveMail) => {
              const buffer: any[] = [];
              message.on('body', (stream, info) => {
                console.log(info);
                stream.on('data', function (chunk) {
                  buffer.push(chunk);
                });
                stream.once('end', function () {
                  const emailBuffer = Buffer.concat(buffer).toString('utf8');
                  MailParser.simpleParser(emailBuffer, async (err, parsed) => {
                    if (err) {
                      console.log('Error while parsing', err);
                    } else {
                      console.log('Parsed email:', parsed);
                      emailArray.push(parsed);
                      resolveMail(parsed);
                    }
                  });
                });
              });
              message.once(
                'attributes',
                (attrs: Imap.ImapMessageAttributes) => {
                  const parts = this.findAttachmentParts(attrs.struct, []);
                  for (let i = 0, len = parts.length; i < len; ++i) {
                    const attachment = parts[i];
                    console.log(
                      'Fetching attachment %s',
                      attachment.params.name,
                    );
                    const f = this.imap.fetch(attrs.uid, {
                      //do not use imap.seq.fetch here
                      bodies: [attachment.partID],
                      struct: true,
                    });
                    f.on('message', (message) => {
                      let buffer = '';
                      message.on('body', (stream) => {
                        // Collect the body content of the attachment
                        stream.on('data', function (chunk) {
                          buffer += chunk.toString('utf8');
                        });
                        stream.once('end', function () {
                          // Prepare the file path for saving
                          const fileName = attachment.params.name;
                          console.log('filename: ', fileName);
                          const filePath = './downloads/' + fileName;
                          //const filePath = path.join(__dirname, 'downloads', fileName);
                          // Write the attachment data to a file
                          fs.writeFile(filePath, buffer, (err) => {
                            if (err) {
                              console.error('Error saving attachment:', err);
                            } else {
                              console.log(`Attachment saved: ${filePath}`);
                            }
                          });
                        });
                      });
                    });
                  }
                },
              );
            }),
          );
        });
        emails.once('end', async () => {
          await Promise.all(emailPromises); // Ensure all parsing completes
          resolve(emailArray);
        });
        emails.once('error', (fetchErr) => {
          console.error('IMAP Fetch Error:', fetchErr);
          reject(fetchErr);
        });
      });
    });
  }

  async closeConnection() {
    if (this.imap) {
      this.imap.end();
      console.log('Connection closed');
    } else {
      console.log('NONE');
    }
  }

  onModuleDestroy() {
    if (this.imap) {
      this.imap.end();
    }
  }
}
