import { supabase } from "../lib/supabase";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGOUT"
  | "PROFILE_CREATED"
  | "PROFILE_UPDATED"
  | "LEGACY_DATA_MIGRATED"
  | "RECORD_CREATED"
  | "RECORD_UPDATED"
  | "RECORD_DELETED"
  | "SETTINGS_CHANGED";

export interface AuditEventPayload {
  actorUserId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  beforeData?: any;
  afterData?: any;
  source?: string;
  requestId?: string;
}

export interface StoredAuditEvent {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  before_data: any;
  after_data: any;
  source: string;
  request_id: string | null;
  created_at: string;
}

const LOCAL_AUDIT_KEY = "neuroconecta_audit_local_cache";

/**
 * Sanitizes data to ensure no passwords, secrets, or tokens are logged into audit_events
 */
function sanitizeAuditData(data: any): any {
  if (!data || typeof data !== "object") return data;
  const clone = { ...data };
  const forbiddenKeys = [
    "password",
    "senha",
    "token",
    "access_token",
    "refresh_token",
    "anonKey",
    "secret",
    "apiKey",
  ];
  for (const key of Object.keys(clone)) {
    if (forbiddenKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      clone[key] = "[REDACTED_SECURITY]";
    } else if (typeof clone[key] === "object") {
      clone[key] = sanitizeAuditData(clone[key]);
    }
  }
  return clone;
}

export const auditService = {
  /**
   * Log an immutable audit event to Supabase public.audit_events
   * With resilient non-blocking fallback to local audit trail cache if offline
   */
  async log(payload: AuditEventPayload): Promise<void> {
    const sanitizedBefore = sanitizeAuditData(payload.beforeData);
    const sanitizedAfter = sanitizeAuditData(payload.afterData);
    const source = payload.source || "neuroconecta_web_client";
    const timestamp = new Date().toISOString();

    const localEntry: StoredAuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actor_user_id: payload.actorUserId || null,
      action: payload.action,
      entity_type: payload.entityType,
      entity_id: payload.entityId || null,
      before_data: sanitizedBefore || null,
      after_data: sanitizedAfter || null,
      source,
      request_id: payload.requestId || null,
      created_at: timestamp,
    };

    // Cache locally for fast immediate inspection and offline resilience
    try {
      const raw = localStorage.getItem(LOCAL_AUDIT_KEY) || "[]";
      const list = JSON.parse(raw);
      list.unshift(localEntry);
      if (list.length > 200) list.length = 200; // Cap cache
      localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(list));
    } catch {
      // ignore local cache error
    }

    // Persist to Supabase if authenticated actor
    if (payload.actorUserId) {
      try {
        await supabase.from("audit_events").insert({
          actor_user_id: payload.actorUserId,
          action: payload.action,
          entity_type: payload.entityType,
          entity_id: payload.entityId || null,
          before_data: sanitizedBefore || null,
          after_data: sanitizedAfter || null,
          source,
          request_id: payload.requestId || null,
          created_at: timestamp,
        });
      } catch (err) {
        console.warn("Auditoria remota: registrado no cache de resiliência local.", err);
      }
    }
  },

  /**
   * Get audit history for the current authenticated user
   */
  async listForUser(actorUserId: string): Promise<StoredAuditEvent[]> {
    try {
      const { data, error } = await supabase
        .from("audit_events")
        .select("*")
        .eq("actor_user_id", actorUserId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data as StoredAuditEvent[];
      }
    } catch (e) {
      console.warn("Falha ao buscar auditoria remota, lendo cache:", e);
    }

    // Fallback to local cache
    try {
      const raw = localStorage.getItem(LOCAL_AUDIT_KEY) || "[]";
      const list = JSON.parse(raw) as StoredAuditEvent[];
      return list.filter((item) => !item.actor_user_id || item.actor_user_id === actorUserId);
    } catch {
      return [];
    }
  },
};
