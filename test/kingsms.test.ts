import "dotenv/config";
import { describe, expect, it } from "vitest";
import KingSMSClient from "../src/index";

const login = process.env.KING_SMS_USER!;
const token = process.env.KING_SMS_TOKEN!;
const to = process.env.KING_SMS_TO!;

let messageId: string | undefined;

describe("KingSMSClient (integration)", () => {
  it("check balance (getAmont) succeeds", async () => {
    const client = new KingSMSClient({
      login: login as string,
      token: token as string,
    });
    const res = await client.getAmont();
    console.log("getAmont response:", res);

    expect(res.status).toBe("success");
    expect(res.cause).toMatch(/Credit|Saldo|SMS/i);
  });

  it("send SMS (guarded, may incur cost)", async () => {
    const client = new KingSMSClient({
      login: login,
      token: token,
    });

    const res = await client.sendSMS({
      numero: to,
      msg: `Teste via Vitest às ${new Date().toISOString()}`,
    });

    console.log("sendSMS response:", res);

    expect(res.status).toBe("success");
    expect(res.id).toBeTruthy();

    const status = await client.checkStatus(res.id!);
    expect(["success", "pending", "error"]).toContain(status.status);

    messageId = res.id;
  });

  it("check status (guarded, may incur cost)", async () => {
    const client = new KingSMSClient({
      login: login,
      token: token,
    });

    const res = await client.checkStatus(messageId!);

    console.log("checkStatus response:", res);

    expect(["success", "pending"]).toContain(res.status);
  });
});
