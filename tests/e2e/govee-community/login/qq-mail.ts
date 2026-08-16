import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

type VerificationCodeOptions = {
  email: string;
  authCode: string;
  requestedAfter: Date;
  timeoutMs?: number;
};

const POLL_INTERVAL_MS = 3_000;
const DEFAULT_TIMEOUT_MS = 120_000;

function extractVerificationCode(content: string): string | undefined {
  const patterns = [
    /(?:verification|security|authentication|auth|code)[^\d]{0,80}(\d{4})(?!\d)/i,
    /(?<!\d)(\d{4})[^\d]{0,80}(?:verification|security|authentication|auth|code)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export async function waitForGoveeVerificationCode({
  email,
  authCode,
  requestedAfter,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: VerificationCodeOptions): Promise<string> {
  const client = new ImapFlow({
    host: 'imap.qq.com',
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: authCode,
    },
    logger: false,
  });
  const deadline = Date.now() + timeoutMs;

  await client.connect();

  try {
    const lock = await client.getMailboxLock('INBOX');

    try {
      while (Date.now() < deadline) {
        await client.noop();

        const uids = await client.search(
          { since: new Date(requestedAfter.getTime() - 60_000) },
          { uid: true },
        );

        if (uids && uids.length > 0) {
          const messages = [];

          for await (const message of client.fetch(
            uids.slice(-20),
            { envelope: true, internalDate: true, source: true },
            { uid: true },
          )) {
            const receivedAt = new Date(message.internalDate ?? 0);

            if (
              message.source &&
              receivedAt.getTime() >= requestedAfter.getTime() - 30_000
            ) {
              messages.push({ receivedAt, source: message.source });
            }
          }

          messages.sort(
            (left, right) => right.receivedAt.getTime() - left.receivedAt.getTime(),
          );

          for (const message of messages) {
            const parsed = await simpleParser(message.source);
            const content = [
              parsed.subject,
              parsed.from?.text,
              parsed.text,
              parsed.html,
            ]
              .filter(Boolean)
              .join('\n');

            if (!/govee/i.test(content)) {
              continue;
            }

            const code = extractVerificationCode(content);
            if (code) {
              return code;
            }
          }
        }

        await sleep(POLL_INTERVAL_MS);
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => undefined);
  }

  throw new Error('等待 Govee 邮箱验证码超时');
}
