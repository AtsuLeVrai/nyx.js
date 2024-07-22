export type AuthTypes = "Bearer" | "Bot";

export type DiscordHeaders = {
	Authorization: `${AuthTypes} ${string}`;
	"Content-Type": "application/json" | "application/ld+json" | "application/msword" | "application/pdf" | "application/sql" | "application/vnd.api+json" | "application/vnd.microsoft.portable-executable" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "application/vnd.oasis.opendocument.text" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/x-www-form-urlencoded" | "application/xml" | "application/zip" | "application/zstd" | "audio/mpeg" | "audio/ogg" | "image/avif" | "image/jpeg" | "image/png" | "image/svg+xml" | "image/tiff" | "model/obj" | "multipart/form-data" | "text/css" | "text/csv" | "text/html" | "text/javascript" | "text/plain" | "text/xml";
	"User-Agent": string;
	"X-Audit-Log-Reason": string;
	"X-RateLimit-Bucket": string;
	"X-RateLimit-Global": boolean;
	"X-RateLimit-Limit": number;
	"X-RateLimit-Remaining": number;
	"X-RateLimit-Reset": number;
	"X-RateLimit-Reset-After": number;
	"X-RateLimit-Scope": "global" | "shared" | "user";
	"X-Signature-Ed25519": string;
	"X-Signature-Timestamp": string;
};