import type { IsoO8601Timestamp, Snowflake } from "@nyxjs/core";
import type {
	ListSkuSubscriptionsQuery,
	SubscriptionStatus,
	SubscriptionStructure,
} from "@nyxjs/rest";
import { SubscriptionRoutes } from "@nyxjs/rest";
import { Base } from "./Base";
import type { Client } from "./Client";

export class Subscription extends Base<SubscriptionStructure> {
	public canceledAt!: IsoO8601Timestamp | null;

	public country?: string;

	public currentPeriodEnd!: IsoO8601Timestamp;

	public currentPeriodStart!: IsoO8601Timestamp;

	public entitlementIds!: Snowflake[];

	public id!: Snowflake;

	public skuIds!: Snowflake[];

	public status!: SubscriptionStatus;

	public userId!: Snowflake;

	public constructor(
		private readonly client: Client,
		data: Partial<SubscriptionStructure>,
	) {
		super(data);
	}

	public async get(
		skuId: Snowflake,
		subscriptionId: Snowflake,
	): Promise<Subscription> {
		const response = await this.client.rest.request(
			SubscriptionRoutes.getSkuSubscription(skuId, subscriptionId),
		);
		return new Subscription(this.client, response);
	}

	public async list(
		skuId: Snowflake,
		query?: ListSkuSubscriptionsQuery,
	): Promise<Subscription[]> {
		const response = await this.client.rest.request(
			SubscriptionRoutes.listSkuSubscriptions(skuId, query),
		);
		return response.map(
			(subscription) => new Subscription(this.client, subscription),
		);
	}
}

export { SubscriptionStatus } from "@nyxjs/rest";
