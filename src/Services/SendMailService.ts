import nodemailer, { Transporter } from 'nodemailer'
import handlebars from "handlebars";
import fs from "fs";


class SendMailService {

    private client: Transporter;

    constructor() {

        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            this.client = transporter;
        })

    }

    async execute(to: string, subject: string, variables: object, path: string) {

        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables);

        this.client.sendMail({
            to,
            subject,
            html: html,
            from: "NPS <noreplay@nps.com.br>"
        },
            (err, info) => {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            }
        );

    }

}

export default new SendMailService();