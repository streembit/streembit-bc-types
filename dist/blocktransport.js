"use strict";
/**
 * Block Transport Interface
 *
 * Abstraction for block propagation between nodes.
 * Implementations can use NATS JetStream, RabbitMQ, Kafka, HTTP, etc.
 *
 * The transport layer handles:
 * - Message delivery guarantees
 * - Ordering guarantees
 * - Deduplication
 * - Connection management
 * - Health monitoring
 *
 * Synchronizer layer handles:
 * - Recovery logic
 * - Undo/redo operations
 * - Published marker management
 * - Block metadata
 */
Object.defineProperty(exports, "__esModule", { value: true });
