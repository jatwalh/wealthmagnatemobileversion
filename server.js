const express = require('express');
const Imap = require('imap');
const app = express();
const port = 3000;

const imapConfig = {
  user: 'strategy1@thewealthmagnet.co.in',
  password: 'qykmaX-takpi8-fobgos',
  host: '162.241.194.56',
  port: 993, // IMAP over SSL
  tls: true,
};

app.get('/fetchEmailAlerts', (req, res) => {
  const imap = new Imap(imapConfig);

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        res.status(500).json({ error: err.message });
        imap.end();
        return;
      }

      const emailAlerts = [];

      imap.search(['UNSEEN'], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: '', markSeen: true });

        fetch.on('message', (msg) => {
          const emailAlert = {
            subject: '',
            from: '',
            text: '',
          };

          msg.on('headers', (headers) => {
            emailAlert.subject = headers.get('subject');
            emailAlert.from = headers.get('from');
          });

          msg.on('data', (chunk) => {
            emailAlert.text += chunk.toString('utf8');
          });

          msg.on('end', () => {
            emailAlerts.push(emailAlert);
          });
        });

        fetch.once('end', () => {
          res.json({ emailAlerts });
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    res.status(500).json({ error: err.message });
    imap.end();
  });

  imap.connect();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
