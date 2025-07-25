const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/ConnectionRequest");
const sendEmail = require("./sendEmail");

//This job will run at 8 am in the morning everyday
cron.schedule("0 8 * * * ", async () => {
  //Send Emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const uniqueEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
    ];
    for (const email of uniqueEmails) {
      //Send Emails
      try {
        const res = await sendEmail.run(
          email,
          "noreply@devconnector.info",
          "You Have New Friend Requests!",
          "There are pending friend requests. Please log in to DevConnector to respond."
        );
        console.log("Email sent to:", email, res);
      } catch (error) {
        console.error("Cron Job Error:", error);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
