import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (data: any) => {
  try {
    await resend.emails.send({
      from: "Sardar Bio <onboarding@resend.dev>",
      to: ["sardar2004.rjt@gmail.com"],
      subject: `New Contact: ${data.subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Message:</b><br/>${data.message}</p>
      `,
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
  }
};