import {
  date,
  mysqlTable,
  varchar,
  mysqlEnum,
  datetime,
  int,
  text,
  boolean,
  primaryKey,
  unique,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import {
  contentTypeEnum,
  poetBloggerReqRoleEnum,
  poetBloggerReqStatusEnum,
  userRolesEnum,
  userRolesObj,
} from "../../helpers/constants.js";

const STD_UUIDV4_LEN = 38;

export const users = mysqlTable("user_account", {
  id: varchar("id", { length: STD_UUIDV4_LEN })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  joinedAt: date("joined_at").$defaultFn(() => new Date()),
  about: varchar("about", { length: 1000 }),
  role: mysqlEnum("role", userRolesEnum).default(userRolesObj.guest),
});

export const sessions = mysqlTable("user_session", {
  id: varchar("id", { length: STD_UUIDV4_LEN })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  refresh: text("refresh").notNull(),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: datetime("expires").notNull(),
});

export const blogs = mysqlTable("blog", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 150 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  content: text("content").notNull(),
  createdAt: datetime("created_at", { mode: "date" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: datetime("updated_at", { mode: "date" }).$onUpdateFn(
    () => new Date(),
  ),
  archive: boolean("archive").default(false),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const poems = mysqlTable("poem", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 150 }).notNull(),
  content: text("content").notNull(),
  createdAt: datetime("created_at", { mode: "date" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: datetime("updated_at", { mode: "date" }).$onUpdateFn(
    () => new Date(),
  ),
  archive: boolean("archive").default(false),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const blogLikes = mysqlTable(
  "blog_like",
  {
    blogId: int("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: STD_UUIDV4_LEN })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ name: "blog_user_pk", columns: [table.blogId, table.userId] }),
  ],
);

export const poemLikes = mysqlTable(
  "poem_like",
  {
    poemId: int("poem_id")
      .notNull()
      .references(() => poems.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: STD_UUIDV4_LEN })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ name: "poem_user_pk", columns: [table.poemId, table.userId] }),
  ],
);

export const blogComments = mysqlTable("blog_comment", {
  id: int("id").primaryKey().autoincrement(),
  blogId: int("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 1000 }).notNull(),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").$onUpdateFn(() => new Date()),
});

export const poemComments = mysqlTable("poem_comment", {
  id: int("id").primaryKey().autoincrement(),
  poemId: int("poem_id")
    .notNull()
    .references(() => poems.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 1000 }).notNull(),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").$onUpdateFn(() => new Date()),
});

export const poetBloggerRequests = mysqlTable("poet_blogger_request", {
  id: int("id").primaryKey().autoincrement(),
  sample: text("sample").notNull(),
  userId: varchar("user_id", { length: STD_UUIDV4_LEN })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  requestDate: datetime("request_date").$defaultFn(() => new Date()),
  status: mysqlEnum("status", poetBloggerReqStatusEnum),
  role: mysqlEnum("role", poetBloggerReqRoleEnum),
});

export const poemBlogCorrectionRequests = mysqlTable(
  "poem_blog_correction_request",
  {
    id: int("id").primaryKey().autoincrement(),
    correction: varchar("correction", { length: 1000 }).notNull(),
    contentId: int("content_id").notNull(),
    contentType: mysqlEnum("content_type", contentTypeEnum),
    userId: varchar("user_id", { length: STD_UUIDV4_LEN })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deadline: datetime("deadline").notNull(),
  },
  (table) => [
    unique("content_type_id_unique_index").on(
      table.contentId,
      table.contentType,
    ),
  ],
);
