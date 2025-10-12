import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profileTable = pgTable("profile", {
	id: uuid("id").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	documentType: text("document_type"),
	document: text("document").unique(),
	role: text("role").notNull().default("user"), // "admin" o "user"
	isAuthorized: boolean("is_authorized").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});
