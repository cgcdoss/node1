import { Request, Response } from "express";
import mailer from 'nodemailer';

class EmailSender {
  async enviaEmail(req: Request, res: Response): Promise<void> {

    const mailSender = mailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORTSMTP,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      /* secure: true,
      tls: {
        rejectUnauthorized: false
      } */
    } as mailer.TransportOptions);

    await new Promise((resolve, reject) =>
      mailSender.sendMail({
        from: req.body.remetente,
        to: req.body.destinatario,
        subject: req.body.assunto,
        text: req.body.mensagem,
      }, (error, info) => {
        if (error) {
          reject({ msg: 'Falha ao enviar email', data: { error, info } });
        } else {
          resolve({ msg: 'Email enviado com sucesso', data: { info } });
        }
      }))
      .then(resp => res.status(200).json(resp))
      .catch(err => res.status(400).json(err));
  }

  enviaEmailSemPromise(req: Request, res: Response): void {
    const mailSender = mailer.createTransport({
      // host: process.env.HOST,
      // port: process.env.PORTSMTP,
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
    } as mailer.TransportOptions);


    mailSender.sendMail({
      from: req.body.remetente,
      to: req.body.destinatario,
      subject: req.body.assunto,
      text: req.body.mensagem,
    }, (error, info) => {
      if (error) {
        res.status(400).json({ msg: 'Falha ao enviar email', data: { error, info } });
      } else {
        res.status(200).json({ msg: 'Email enviado com sucesso', data: { info } });
      }
    });
  }

  sendEmail(options: any): void {
    console.log('vai enviar email');

    const mailSender = mailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORTSMTP,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    } as mailer.TransportOptions);

    mailSender.sendMail({
      from: options.remetente,
      to: options.destinatario,
      subject: options.assunto,
      // text: options.mensagem,
      html: options.html
    }, (error, info) => {
      if (error) {
        console.log('erro no envio de email', error);
      } else {
        console.log('enviou email');
      }
    });
  }
}

export default new EmailSender();
