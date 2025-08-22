import "dotenv/config";
import { describe, expect, it } from "vitest";
import KingSMSClient from "../src/index";

const login = process.env.KINK_SMS_USER || process.env.KING_SMS_USER;
const token = process.env.KINK_SMS_TOKEN || process.env.KING_SMS_TOKEN;
const to = process.env.KINK_SMS_TO || process.env.KING_SMS_TO;

describe("KingSMSClient (integration)", () => {
  it("check balance (getAmont) succeeds", async () => {
    const client = new KingSMSClient({
      login: login as string,
      token: token as string,
    });
    const res = await client.getAmont();
    expect(res.status).toBe("success");
    expect(res.cause).toMatch(/Credit|Saldo|SMS/i);
  });

  it("send SMS (guarded, may incur cost)", async () => {
    const client = new KingSMSClient({
      login: login as string,
      token: token as string,
    });

    const res = await client.sendSMS({
      numero: to as string,
      msg: `Teste via Vitest às ${new Date().toISOString()}`,
    });
    expect(res.status).toBe("success");
    expect(res.id).toBeTruthy();

    const status = await client.checkStatus(res.id!);
    expect(["success", "pending", "error"]).toContain(status.status);
  });
});
