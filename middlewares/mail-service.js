'use strict';

const nodemailer = require('nodemailer');
const moment = require('moment');
const auth = require('./auth');

async function sendMail() {
    const {clientId, clientSecret, tokens} = await auth.getCredentials();
    const {access_token, refresh_token} = tokens;

    console.log(JSON.stringify({
        user: '',
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refresh_token,
        accessToken: access_token
    }));
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: '',
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refresh_token,
            accessToken: access_token
        }
    });
    let today = moment();
    let nextDueDate = moment().date(0);
    if (nextDueDate.isBefore(today)) nextDueDate.add(1, 'months');
    let lastMonth = nextDueDate.clone().subtract(1, 'months');

    let todayFormatted = today.locale('pt-br').format('DD/MMMM/YYYY').toLowerCase();
    let nextDueDateFormatted = nextDueDate.locale('pt-br').format('DD/MMMM/YYYY').toLowerCase();

    let lastMonthFormatted = lastMonth.locale('pt-br').format('MMMM/YYYY').toLowerCase();
    let missingDays = nextDueDate.diff(today, 'days');

    console.log(JSON.stringify({
        today: todayFormatted,
        nextDueDate: nextDueDateFormatted,
        missingDays,
        lastMonth: lastMonthFormatted
    }));

    const mailOptions = {
        from: '',
        to: [''],
        subject: `Condomínio ref. ${lastMonthFormatted}`,
        generateTextFromHTML: true,
        html:
            `
<br/>
<br/>
Este é um e-mail automático para lembrá-la que falta${missingDays > 1 ? 'm' : ''} ${missingDays} dia${missingDays > 1 ? 's' : ''} para o vencimento do aluguel. Não esqueça de enviá-lo para o endereço <a href="mailto:"></a>.
<br/>
Caso o envio já tenha sido efetuado, por favor, desconsidere este aviso.
<br/>
<br/>
Atenciosamente,
<br/>

        `
    };

    return transport.sendMail(mailOptions);
}

module.exports = {sendMail};