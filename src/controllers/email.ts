import { Request, Response } from "express";
import mailer from 'nodemailer';

class EmailSender {
  async enviaEmail(req: Request, res: Response): Promise<void> {
    const remetente = mailer.createTransport({
      host: req.body.host,
      port: req.body.port,
      secure: true,
      auth: {
        user: req.body.remetente.email,
        pass: req.body.remetente.senha,
      },
    });

    await new Promise((resolve, reject) =>
      remetente.sendMail({
        from: req.body.remetente.email,
        to: req.body.destinatario.email,
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
    const remetente = mailer.createTransport({
      host: req.body.host,
      port: req.body.port,
      secure: true,
      auth: {
        user: req.body.remetente.email,
        pass: req.body.remetente.senha,
      },
    });

    remetente.sendMail({
      from: req.body.remetente.email,
      to: req.body.destinatario.email,
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
