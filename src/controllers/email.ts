import { Request, Response } from "express";
import mailer from 'nodemailer';

class EmailSender {
  async enviaEmail(req: Request, res: Response): Promise<void> {
    console.log('AQUIIII', process.env.HOST, process.env.PORTSMTP, process.env.USER);
    const mailSender = mailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORTSMTP,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
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
      host: process.env.HOST,
      port: process.env.PORTSMTP,
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
}

export default new EmailSender();
