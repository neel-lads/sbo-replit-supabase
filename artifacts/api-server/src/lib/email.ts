import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: "Sardar Bio Organic <onboarding@resend.dev>", // later change domain
      to: ["sardar2004.rjt@gmail.com"],
      subject: `New Contact: ${data.subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br/>${data.message}</p>
      `,
    });

    console.log("Email sent successfully !");
  } catch (err) {
    console.error("Email error:", err);
  }
}