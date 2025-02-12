import {
  date,
  pgTable,
  text,
  serial,
  char,
  varchar,
  integer,
  boolean,
  timestamp,
  primaryKey,
  pgEnum,
  foreignKey,
} from 'drizzle-orm/pg-core';

// Existing tables
export const usersTable = pgTable('users', {
  id: serial('id').unique().primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
});

export const revokedTokensTable = pgTable('revoked_tokens', {
  token_hash: char({ length: 64 }).notNull().unique().primaryKey(),
  revoked_at: timestamp().defaultNow(),
});

export const exerciseTypeEnum = pgEnum('exercise_type', [
  'executive',
  'sectorial',
]);
export const projectsTable = pgTable('projects', {
  id: serial('id').unique().primaryKey(),
  name: text().notNull().unique(),
  exercise_type: exerciseTypeEnum().notNull(),
  start_date: date().notNull(),
  end_date: date().notNull(),
  email_header: text().notNull(),
  email_footer: text().notNull(),
});

export const entitiesTable = pgTable('entities', {
  id: serial('id').unique().primaryKey(),
  name: varchar().notNull().unique(),
  description: text().notNull(),
  victim_sector: text().notNull(),
  critical_function: text().notNull(),
  policy_documents: text('policy_documents').array().notNull(),
  severity_levels: text(),
});

export const assetsTable = pgTable('assets', {
  id: serial('id').unique().primaryKey(),
  name: varchar().notNull(),
  users: text().notNull(),
  function: text().notNull(),
  sensitive_info: text().notNull(),
  category: text().notNull(),
  entity_id: integer()
    .notNull()
    .references(() => entitiesTable.id),
});

export const participantsTable = pgTable('participants', {
  email: varchar().primaryKey().unique(),
  name: text().notNull(),
  entity_id: integer()
    .notNull()
    .references(() => entitiesTable.id),
});

export const threatLandscapeTable = pgTable(
  'threat_landscape',
  {
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
    threat_actor_name: text(),
    category: text(),
    capability: text(),
    capability_reason: text(),
    intent: text(),
    intent_reason: text(),
    opportunity: text(),
    opportunity_reason: text(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.entity_id, table.threat_actor_name],
      }),
    };
  },
);

export const ttpUsedTable = pgTable(
  'ttp_used',
  {
    id: serial('id').primaryKey(),
    scenario_project_id: integer().notNull(),
    scenario_number: varchar().notNull(),
    tactic: text().notNull(),
    technique: text(),
    notes: text(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.scenario_number, table.scenario_project_id],
      foreignColumns: [
        scenariosTable.scenario_number,
        scenariosTable.project_id,
      ],
    }),
  }),
);

export const scenariosTable = pgTable(
  'scenarios',
  {
    scenario_number: varchar().notNull(),
    additional_context: text().notNull(),
    threat_actor_motivation: text().notNull(),
    intended_system_impact: text().notNull(),
    intended_biz_impact: text().notNull(),
    attack_solution: text().notNull(),
    severity_level: integer().notNull(),
    initial_access: text().notNull(),
    exploit: text().notNull(),
    impact: text().notNull(),
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id),
    asset_id: integer()
      .notNull()
      .references(() => assetsTable.id),
    tactics_techniques: text()
      .notNull()
      .references(() => masterThreatCubesTable.name),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.scenario_number, table.project_id] }),
  }),
);

export const injectsTable = pgTable('injects', {
  inject_id: varchar().unique().primaryKey(),
  // schema draws 1-1, I believe it's many injects to 1 scenario
  scenario_number: varchar()
    .notNull()
    .references(() => scenariosTable.scenario_number),
  date_time: timestamp().notNull(),
  inject_sent: boolean().notNull(),
  inject_desc: text().notNull(),
  inject_type: text().notNull(),
  artefact: text().notNull(),
  entity_id: integer()
    .notNull()
    .references(() => entitiesTable.id),
  from: varchar().notNull(),
  to_recipient: varchar().notNull(),
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
});

export const responsesTable = pgTable('responses', {
  inject_id: varchar()
    .notNull()
    .references(() => injectsTable.inject_id),
  response: text().notNull(),
  id: serial('id').unique().primaryKey(),
});

export const masterThreatCubesTable = pgTable('master_threat_cubes', {
  threat_cube_id: serial('thread_cube_id').unique().primaryKey(), // Use only `id` as primary key
  tactic: text()
    .notNull()
    .references(() => tacticsTable.id),
  name: text(),
});

export const tacticsTable = pgTable('tactics', {
  id: text().primaryKey(),
  name: text().notNull(),
});

// a role is unique identified by the combination of role name and entity id
export const rolesTable = pgTable(
  'roles',
  {
    name: varchar().notNull(),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.entity_id] }),
  }),
);

// ------- JOIN TABLES -------

export const participantsToEntitiesTable = pgTable(
  'entities_to_participants',
  {
    participant_email: integer()
      .notNull()
      .references(() => participantsTable.email),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.participant_email, table.entity_id] }),
  }),
);

export const entitiesToThreatCubesTable = pgTable(
  'entities_to_threat_cubes',
  {
    entity_id: integer().notNull(),
    threat_cube_id: integer() // do we foreign key or not
      .notNull(), // Foreign key referencing threat cube ID
    score: integer().notNull(), // Associated score for entity-threat cube relationship
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.entity_id, table.threat_cube_id, table.project_id],
    }),
  }),
);

export const projectsToThreatCubesTable = pgTable(
  'projects_to_threat_cubes',
  {
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id),
    threat_cube_id: integer().notNull(),
    score: integer().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.project_id, table.threat_cube_id] }),
  }),
);

export const participantsToRolesTable = pgTable(
  'participants_to_roles',
  {
    id: serial('id').unique().primaryKey(),
    participant_email: varchar()
      .notNull()
      .references(() => participantsTable.email),
    role_name: varchar().notNull(),
    role_entity_id: integer().notNull(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.role_name, table.role_entity_id],
      foreignColumns: [rolesTable.name, rolesTable.entity_id],
    }),
  }),
);

export const projectsToEntitiesTable = pgTable(
  'projects_to_entities',
  {
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entity_id, table.project_id] }),
  }),
);

export const assetsToScenariosTable = pgTable(
  'assets_to_scenarios',
  {
    id: serial('id').unique().primaryKey(),
    asset_id: integer()
      .notNull()
      .references(() => assetsTable.id),
    scenario_number: varchar().notNull(),
    scenario_project_id: integer().notNull(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.scenario_number, table.scenario_project_id],
      foreignColumns: [
        scenariosTable.scenario_number,
        scenariosTable.project_id,
      ],
    }),
  }),
);

export const rolesToInjectsTable = pgTable(
  'roles_to_injects',
  {
    id: serial('id').unique().primaryKey(),
    role_name: varchar().notNull(),
    role_entity_id: integer().notNull(),
    inject_id: varchar()
      .notNull()
      .references(() => injectsTable.inject_id),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.role_name, table.role_entity_id],
      foreignColumns: [rolesTable.name, rolesTable.entity_id],
    }),
  }),
);

export const emailsTable = pgTable('emails', {
  id: serial('id').unique().primaryKey(),
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
  to: text().array().notNull(),
  cc: text().array(),
  bcc: text().array(),
  subject: text().notNull(),
  html: text().notNull(),
  attachments: text().array(),
  job_id: integer(),
  schedule_date_time: timestamp(),
  error_message: text(),
  status: text().default('notScheduled'), // status: notScheduled, scheduled, sent, failed
  observations: text(),
});

export const serverTypeEnum = pgEnum('server_type', ['simx1', 'simx2']);

export const serverTable = pgTable('server', {
  server: serverTypeEnum().default('simx1'),
});
