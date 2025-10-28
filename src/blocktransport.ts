
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

import type { Block } from './block';

/**
 * Block propagation transport abstraction
 */
export interface BlockTransport {
    /**
     * Initialize the transport layer (connect, setup streams/topics, etc.)
     * Called once during bootstrap
     */
    initialize(): Promise<void>;

    /**
     * Publish a block to the transport
     * MUST return only after durable storage is confirmed
     *
     * @param block - The block to publish
     * @param blockCount - Current block count
     * @param producerId - Node ID of the producer
     * @throws Error if publish fails (implementation-specific error)
     */
    publishBlock(block: Block, blockCount: number, producerId: string): Promise<void>;

    /**
     * Start consuming blocks from the transport
     *
     * @param localBlockCount - Current local block count (for resumption)
     * @param handler - Async handler for each received block
     *                  Handler should return normally for ACK, throw for NACK
     * @throws Error if consumer setup fails
     */
    startConsuming(
        localBlockCount: number,
        handler: (block: Block, blockCount: number, producerId: string) => Promise<void>
    ): Promise<void>;

    /**
     * Stop consuming blocks (graceful shutdown)
     */
    stopConsuming(): Promise<void>;

    /**
     * Check if transport is healthy and available
     * Used for strict mode - fail fast if transport is down
     *
     * @returns true if healthy, false otherwise
     */
    isHealthy(): Promise<boolean>;
}

