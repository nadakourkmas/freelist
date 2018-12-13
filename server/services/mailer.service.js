var nodemailer = require('nodemailer');

const mailerService = {};

mailerService.sendWillNotifyEmail = (email) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eleoshakathon@gmail.com',
            pass: 'eleos2018hackathon'
        }
    });

    const mailOptions = {
        from: 'eleoshakathon@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Eleos will let you know when your item is free', // Subject line
        html: `
            <p>Hi there :)</p>
            <p>Eleos wasnt able to find any free items...</p>
            <p>We will let you know when anybody posts your item for free</p>
        `// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

module.exports = mailerService;
