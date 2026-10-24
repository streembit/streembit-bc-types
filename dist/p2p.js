"use strict";
/**
 * Messages of the signed peer protocol (P2P_ROUTES in routes.ts), exchanged between the Accountable Node,
 * the validators and the read mirrors. Requests and responses are canonical JSON; the peer authentication
 * signs the transmitted bytes, so these types are the wire format.
 */
Object.defineProperty(exports, "__esModule", { value: true });
