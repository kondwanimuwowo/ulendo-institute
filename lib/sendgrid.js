import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = async ({ to, subject, text, html }) => {
    const msg = {
        to,
        from: 'no-reply@ulendo-institute.com', // Change to your verified sender
        subject,
        text,
        html,
    };

    if (!process.env.SENDGRID_API_KEY) {
        console.log('--- EMAIL LOG START ---');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Text:', text);
        console.log('--- EMAIL LOG END ---');
        return;
    }

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};
