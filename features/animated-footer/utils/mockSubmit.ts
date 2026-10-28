export type MessagePayload = { name: string; email: string; subject: string; message: string };
export type SubmitMessage = (payload: MessagePayload) => Promise<void>;

/**
 * Development stand-in for a real email service. Nothing is sent: it waits a moment and resolves.
 * To go live, pass your own `submitMessage` prop to <AnimatedFooter> (e.g. one that POSTs to an API route
 * or an email provider). It only has to resolve on success and reject on failure; the animation does not change.
 */
export const mockSubmitMessage: SubmitMessage = (payload) =>
  new Promise((resolve) => {
    if (process.env.NODE_ENV !== "production") console.info("[animated-footer] mock submit (no email sent):", payload);
    window.setTimeout(resolve, 700);
  });
