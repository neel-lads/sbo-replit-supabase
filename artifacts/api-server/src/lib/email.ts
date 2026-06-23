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
      subject: `${data.subject}`,
      html: `
        <h2>New Message from Contact Form</h2>
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

export async function sendDealershipEmail(data: {
  name: string;
  firm_name: string;
  email: string;
  phone: string;
  gst_number: string;
  area_pincode: string;
  subject: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: "Sardar Bio Organic <onboarding@resend.dev>",
      to: ["your-email@gmail.com"],
      subject: `New Dealership Enquiry`,
      html: `
        <h2>New Dealership Application</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Firm:</strong> ${data.firm_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>GST:</strong> ${data.gst_number}</p>
        <p><strong>Pincode:</strong> ${data.area_pincode}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br/>${data.message}</p>
      `,
    });

    console.log("Dealership email sent 🚀");
  } catch (err) {
    console.error("Dealership email error:", err);
  }
}