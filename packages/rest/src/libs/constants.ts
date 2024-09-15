import { ApiVersions } from "@nyxjs/core";
import type { RestOptions } from "../types/rest";

export const API_BASE_URL = "https://discord.com/api";

export const DEFAULT_REST_OPTIONS: RestOptions = {
    version: ApiVersions.V10,
    cache_life_time: 60_000,
};