const juice = require('juice');
const { compileTemplate, sendMail } = require('../../utils/mailers');

module.exports = async (job, done) => {
  const { to, subject, template, context } = job.data;
  console.log(`sending ${template} email to ${to}`);
  try {
    const content = await compileTemplate(template, context);
    if (['amourapflorentino@gmail.com', 'greysonrzf@yahoo.com'].includes(to))
      await sendMail(subject, to, juice(content));
    done();
  } catch (err) {
    console.log(err);
    done(err);
  }
};
