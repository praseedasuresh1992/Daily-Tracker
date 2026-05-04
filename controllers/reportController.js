const nodemailer = require("nodemailer");

exports.sendReport = async (req, res) => {
  try {
    const { tasks, email } = req.body;

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ message: "No data to send" });
    }

    // 🔥 Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD, // app password
      },
    });

    // 🔥 Convert tasks to text
    const content = tasks
      .map(
        (t) =>
          `Title: ${t.title}
Category: ${t.category}
Amount: ${t.amount}
Status: ${t.status}
Date: ${new Date(t.createdAt).toLocaleDateString()}
----------------------`
      )
      .join("\n");

    //  Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Filtered Task Report",
      text: content,
      html: `<h3>Filtered Task Report</h3><pre>${content}</pre>`
    });
console.log("📧 Email response:", info);
    res.json({ message: "Email sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};