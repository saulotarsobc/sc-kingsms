import axios, { AxiosInstance } from "axios";

export type SendSMSParams = {
  numero: string | string[];
  msg: string;
  campanha?: string;
  data?: string; // DD-MM-YYYY per docs
  hora?: string; // HH:mm per docs
};

export type SendSMSResponse = {
  status: "success" | "error";
  cause: string;
  id?: string; // present on success
};

export type StatusResponse = {
  status: "success" | "error" | "pending";
  cause: string;
};

export type BalanceResponse = {
  status: "success" | "error";
  cause: string; // e.g., "Credit 1 SMS"
};

export interface KingSMSClientOptions {
  login: string;
  token?: string; // not required for checkStatus, required for sendSMS and getAmount
  baseURL?: string; // override for testing
}

/**
 * Minimal client for KingSMS HTTP API.
 * Docs: http://painel.kingsms.com.br/kingsms/api.php
 */
export class KingSMSClient {
  private readonly http: AxiosInstance;
  private readonly login: string;
  private readonly token?: string;

  constructor(opts: KingSMSClientOptions) {
    this.login = opts.login;
    this.token = opts.token;
    this.http = axios.create({
      baseURL: opts.baseURL ?? "http://painel.kingsms.com.br/kingsms/api.php",
      // The API returns simple JSON; set short timeout but allow override via interceptors if needed
      timeout: 15000,
    });
  }

  /**
   * Send one or more SMS.
   * - Uses acao=sendsms for single number and acao=bulksms for multiple.
   */
  async sendSMS(params: SendSMSParams): Promise<SendSMSResponse> {
    if (!this.token) {
      throw new Error("token is required to send SMS");
    }

    const isBulk = Array.isArray(params.numero)
      ? params.numero.length > 1
      : (params.numero?.split(",").length ?? 0) > 1;

    const numero = Array.isArray(params.numero)
      ? params.numero.join(",")
      : params.numero;

    const query = {
      acao: isBulk ? "bulksms" : "sendsms",
      login: this.login,
      token: this.token,
      numero,
      msg: params.msg,
      ...(params.campanha ? { campanha: params.campanha } : {}),
      ...(params.data ? { data: params.data } : {}),
      ...(params.hora ? { hora: params.hora } : {}),
    };

    const { data } = await this.http.get<SendSMSResponse>("", {
      params: query,
    });

    if (data.status === "error") {
      throw new Error(data.cause || "KingSMS: sendSMS failed");
    }

    return data;
  }

  /**
   * Check delivery status for a message id.
   * API requires only login and id.
   */
  async checkStatus(id: string): Promise<StatusResponse> {
    if (!id) throw new Error("id is required");

    const query = { acao: "reportsms", login: this.login, id };
    const { data } = await this.http.get<StatusResponse>("", { params: query });

    // API may return { status: "pending", cause: "SMS still in the send Queue" }

    if (data.status === "error") {
      throw new Error(data.cause || "KingSMS: checkStatus failed");
    }

    return data;
  }

  /**
   * Get account balance (saldo).
   */
  async getAmount(): Promise<BalanceResponse> {
    // keeping method name as requested
    if (!this.token) {
      throw new Error("token is required to get balance");
    }

    const query = { acao: "saldo", login: this.login, token: this.token };

    const { data } = await this.http.get<BalanceResponse>("", {
      params: query,
    });

    if (data.status === "error") {
      throw new Error(data.cause || "KingSMS: getAmount failed");
    }

    return data;
  }
}

export default KingSMSClient;
