import { ZodSchema } from 'zod';

export type NativePattern = {
  readonly source: string[];
  readonly 'detail-type': string[];
};

export type EventPattern = {
  readonly detailType?: string[];
  readonly source?: string[];
};

/**
 * EventBridgeContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through EventBridge.
 *
 * Main features:
 * - input and output dynamic validation with zod on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 */
export class EventBridgeContract<
  Sources extends readonly string[] = readonly string[],
  EventType extends string = string,
  PayloadSchema extends ZodSchema = ZodSchema,
> {
  public id: string;
  public contractType = 'eventBridge' as const;
  public sources: Sources;
  public eventType: EventType;
  public payloadSchema: PayloadSchema;
  /**
   * a native event pattern:
   * ```ts
   * {
   *    source: string[];
   *    'detail-type': string[];
   * }
   * ```
   */
  public nativePattern: NativePattern;
  /**
   * an event pattern accepted by the CDK:
   * ```ts
   * {
   *    source: string[];
   *    detailType: string[];
   * }
   * ```
   */
  public pattern: EventPattern;

  /**
   * Builds a new EventBridgeContract contract
   */
  constructor({
    id,
    sources,
    eventType,
    payloadSchema,
  }: {
    /**
     * A unique id to identify the contract among stacks. Beware uniqueness!
     */
    id: string;
    /**
     * The sources of the event.
     *
     * @type string[]
     */
    sources: Sources;
    /**
     * The event type.
     *
     * @type string
     */
    eventType: EventType;
    /**
     * A ZodSchema used to validate the payload and infer its type.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    payloadSchema: PayloadSchema;
  }) {
    this.id = id;
    this.sources = sources;
    this.eventType = eventType;
    this.payloadSchema = payloadSchema;
    this.nativePattern = {
      // @ts-expect-error it does not matter that sources are readonly
      source: sources,
      'detail-type': [eventType],
    };
    this.pattern = {
      // @ts-expect-error it does not matter that sources are readonly
      source: sources,
      detailType: [eventType],
    };
  }
}
