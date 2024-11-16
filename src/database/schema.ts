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

export const projectTable = pgTable('project', {
  id: serial('id').unique().primaryKey(),
  name: text().notNull(),
  exercise_type: text({ enum: ['Executive', 'Sectorial'] }).notNull(),
  start_date: date().notNull(),
  end_date: date().notNull(),
  email_header: text().notNull(),
  email_footer: text().notNull(),
  entity_name: text()
    .notNull()
    .references(() => entityTable.name),
});

export const entityTable = pgTable('entity', {
  id: serial('id').unique().primaryKey(),
  name: varchar().notNull().unique(),
  description: text().notNull(),
  victim_sector: text().notNull(),
  CII: varchar().notNull(),
  critical_function: text().notNull(),
  policy_documents: varchar().notNull(),
  participants: varchar().notNull(),
  real_threat_landscape: varchar().notNull(),
});

export const CIITable = pgTable('CII', {
  id: serial('id').unique().primaryKey(),
  name: varchar()
    .notNull()
    .references(() => entityTable.CII),
  users: text().notNull(),
  function: text().notNull(),
  sensitive_info: text().notNull(),
  category: text().notNull(),
});

export const participantsTable = pgTable('participants', {
  email: varchar().primaryKey().unique(),
  role: text().notNull(),
  name: text()
    .notNull()
    .references(() => entityTable.participants),
});

export const threatActorTable = pgTable('threat_actor', {
  id: serial('id').unique().primaryKey(),
  name: varchar().notNull(),
  threat_landscape: text().notNull(),
  category: text().notNull(),
  intent: text().notNull(),
  rationale: text().notNull(),
  capabilities: text().notNull(),
  project: varchar()
    .notNull()
    .references(() => projectTable.name),
});

export const scenariosTable = pgTable('scenarios', {
  scenario_number: varchar().unique().primaryKey(),
  threat_actor: varchar()
    .notNull()
    .references(() => threatActorTable.name),
  threat_actor_motivation: text().notNull(),
  entity: varchar()
    .notNull()
    .references(() => entityTable.name),
  CII: varchar().notNull(),
  intended_system_impact: text().notNull(),
  intended_biz_impact: text().notNull(),
  attack_solution: text().notNull(),
  severity_level: integer().notNull(),
  initial_access: text().notNull(),
  exploit: text().notNull(),
  impact: text().notNull(),
  tactics_techniques: text().notNull(),
  project: varchar()
    .notNull()
    .references(() => projectTable.name),
});

export const injectsTable = pgTable('injects', {
  scenario_number: varchar()
    .notNull()
    .references(() => scenariosTable.scenario_number),
  date_time: date().notNull(),
  inject_sent: boolean().notNull(),
  inject_desc: text().notNull(),
  inject_type: text().notNull(),
  artefact: text().notNull(),
  entity: varchar().references(() => entityTable.name),
  from: varchar().notNull(),
  to_recipient: varchar().notNull(),
  project: varchar()
    .notNull()
    .references(() => projectTable.name),
  inject_id: varchar().unique().primaryKey(),
  observation: text().notNull(),
});

export const responsesTable = pgTable('responses', {
  inject_id: varchar()
    .notNull()
    .references(() => injectsTable.inject_id),
  response: text().notNull(),
  id: serial('id').unique().primaryKey(),
});

export const roleTable = pgTable('role', {
  name: varchar().unique().primaryKey(),
  project: varchar()
    .notNull()
    .references(() => projectTable.name),
});

export const masterThreatCubesTable = pgTable('master_threat_cubes', {
  category: text().notNull(),
  name: text().notNull().unique(),
  id: serial('id').unique().primaryKey(), // Use only `id` as primary key
});

// ------- JOIN TABLES -------
export const entityThreatCubeTable = pgTable('entity_threat_cube', {
  entity_name: varchar()
    .notNull()
    .references(() => entityTable.name), // Foreign key referencing entity name
  entity_id: integer().unique().primaryKey(), // Unique ID for each row
  threat_cube_id: integer()
    .notNull()
    .references(() => masterThreatCubesTable.id), // Foreign key referencing threat cube ID
  score: integer().notNull(), // Associated score for entity-threat cube relationship
});

export const participantsRolesTable = pgTable('participants_roles', {
  participant_email: varchar().references(() => participantsTable.email),
  role_name: varchar().references(() => roleTable.name),
});

export const projectThreatActorTable = pgTable('project_threat_actor', {
  project_name: varchar()
    .notNull()
    .references(() => projectTable.name),
  threat_actor_id: integer()
    .notNull()
    .references(() => threatActorTable.id),
});

export const projectEntityTable = pgTable('project_entity', {
  project_id: integer().unique().primaryKey(),
  project_name: varchar()
    .notNull()
    .references(() => projectTable.name),
  entity_id: integer()
    .notNull()
    .references(() => entityTable.id),
});

export const CIIScenariosTable = pgTable('CII_scenarios', {
  CII_id: integer()
    .notNull()
    .references(() => CIITable.id),
  scenario_number: varchar()
    .notNull()
    .references(() => scenariosTable.scenario_number),
});

export const masterThreatCubesThreatActorTable = pgTable(
  'master_threat_cubes_threat_actor',
  {
    threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id),
    threat_actor_id: integer()
      .notNull()
      .references(() => threatActorTable.id),
  },
);

export const masterThreatCubesScenariosTable = pgTable(
  'master_threat_cubes_scenarios',
  {
    threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id),
    scenario_number: varchar()
      .notNull()
      .references(() => scenariosTable.scenario_number),
  },
);

export const roleInjectsTable = pgTable('role_injects', {
  role_name: varchar()
    .notNull()
    .references(() => roleTable.name),
  inject_id: varchar()
    .notNull()
    .references(() => injectsTable.inject_id),
});
