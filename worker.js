
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return Response.json(
          { error: "Method not allowed." },
          {
            status: 405,
            headers: { Allow: "POST" }
          }
        );
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return Response.json(
          { error: "Request body must be valid JSON." },
          { status: 400 }
        );
      }

      const name =
        typeof body.name === "string" ? body.name.trim() : "";
      const email =
        typeof body.email === "string" ? body.email.trim() : "";
      const message =
        typeof body.message === "string" ? body.message.trim() : "";

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (
        !name ||
        name.length > 100 ||
        !validEmail ||
        email.length > 254 ||
        !message ||
        message.length > 5000
      ) {
        return Response.json(
          { error: "Please provide a valid name, email, and message." },
          { status: 400 }
        );
      }

      try {
        await env.rookie_training_messages
          .prepare(
            "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)"
          )
          .bind(name, email, message)
          .run();
      } catch (error) {
        console.error("Database insert failed:", error);

        return Response.json(
          { error: "Unable to save your message right now." },
          { status: 500 }
        );
      }

      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: env.FROM_EMAIL,
            to: [env.NOTIFY_EMAIL],
            subject: "New contact form message",
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
          })
        });

        if (!emailResponse.ok) {
          const errorDetails = await emailResponse.text();
          console.error("Resend request failed:", errorDetails);

          return Response.json(
            {
              error:
                "Your message was saved, but the email notification failed. Please try again later."
            },
            { status: 502 }
          );
        }
      } catch (error) {
        console.error("Email request failed:", error);

        return Response.json(
          {
            error:
              "Your message was saved, but the email notification failed."
          },
          { status: 502 }
        );
      }

      return Response.json({ success: true });
    }

    return env.ASSETS.fetch(request);
  }
};
