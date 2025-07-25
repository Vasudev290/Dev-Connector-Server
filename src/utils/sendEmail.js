const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<div style="font-family:Arial,sans-serif;line-height:1.5">
                   <h2>${subject}</h2>
                   <p>${body}</p>
                 </div>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (
  subject,
  body,
  toEmailId,
  fromEmailId = "noreply@devconnector.info"
) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmailId,
    fromEmailId,
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    if (error.name === "MessageRejected") return error;
    throw error;
  }
};

module.exports = { run };
