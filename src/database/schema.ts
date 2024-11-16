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

export const projectsTable = pgTable('projects', {
  id: serial('id').unique().primaryKey(),
  name: text().notNull(),
  exercise_type: text({ enum: ['Executive', 'Sectorial'] }).notNull(),
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
  policy_documents: varchar().notNull(),
});

export const CIITable = pgTable('CII', {
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

export const threatActorsTable = pgTable('threat_actors', {
  id: serial('id').unique().primaryKey(),
  name: varchar().notNull(),
  category: text().notNull(),
  intent: text().notNull(),
  rationale: text().notNull(),
  capabilities: text().notNull(),
});

export const scenariosTable = pgTable('scenarios', {
  scenario_number: varchar().unique().primaryKey(),
  asset: varchar().notNull(),
  additional_context: text().notNull(),
  threat_actor_id: integer()
    .notNull()
    .references(() => threatActorsTable.id),
  threat_actor_motivation: text().notNull(),
  entity_id: integer()
    .notNull()
    .references(() => entitiesTable.id),
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
});

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
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
  // observation nullable because initially empty
  observation: text(),
});

export const responsesTable = pgTable('responses', {
  inject_id: varchar()
    .notNull()
    .references(() => injectsTable.inject_id),
  response: text().notNull(),
  id: serial('id').unique().primaryKey(),
});

export const masterThreatCubesTable = pgTable('master_threat_cubes', {
  category: text().notNull(),
  name: text().notNull().unique(),
  id: serial('id').unique().primaryKey(), // Use only `id` as primary key
});

// TODO: should there be a composite primary key for name + project ID?
// if we decide to pursue that, participants + roles join table will be abit complicated
export const rolesTable = pgTable('roles', {
  name: varchar().unique().primaryKey(),
  // 1 project to many roles OR 1 role to 1 project?
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
});

// ------- JOIN TABLES -------

export const entitiesToMasterThreatCubesTable = pgTable(
  'entities_to_master_threat_cubes',
  {
    master_threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entity_id, table.master_threat_cube_id] }),
  }),
);

export const entitiesToThreatCubesTable = pgTable(
  'entities_to_threat_cubes',
  {
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id),
    threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id), // Foreign key referencing threat cube ID
    score: integer().notNull(), // Associated score for entity-threat cube relationship
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entity_id, table.threat_cube_id] }),
  }),
);

export const participantsToRolesTable = pgTable(
  'participants_to_roles',
  {
    participant_email: varchar()
      .notNull()
      .references(() => participantsTable.email),
    role_name: varchar()
      .notNull()
      .references(() => rolesTable.name),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.participant_email, table.role_name] }),
  }),
);

export const projectsToThreatActorsTable = pgTable(
  'projects_to_threat_actors',
  {
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id),
    threat_actor_id: integer()
      .notNull()
      .references(() => threatActorsTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.project_id, table.threat_actor_id] }),
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

export const CIIToScenariosTable = pgTable(
  'CII_to_scenarios',
  {
    CII_id: integer()
      .notNull()
      .references(() => CIITable.id),
    scenario_number: varchar()
      .notNull()
      .references(() => scenariosTable.scenario_number),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.CII_id, table.scenario_number] }),
  }),
);

export const masterThreatCubesToThreatActorsTable = pgTable(
  'master_threat_cubes_to_threat_actors',
  {
    threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id),
    threat_actor_id: integer()
      .notNull()
      .references(() => threatActorsTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.threat_actor_id, table.threat_cube_id] }),
  }),
);

export const masterThreatCubesToScenariosTable = pgTable(
  'master_threat_cubes_to_scenarios',
  {
    threat_cube_id: integer()
      .notNull()
      .references(() => masterThreatCubesTable.id),
    scenario_number: varchar()
      .notNull()
      .references(() => scenariosTable.scenario_number),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.threat_cube_id, table.scenario_number] }),
  }),
);

export const rolesToInjectsTable = pgTable(
  'roles_to_injects',
  {
    role_name: varchar()
      .notNull()
      .references(() => rolesTable.name),
    inject_id: varchar()
      .notNull()
      .references(() => injectsTable.inject_id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.role_name, table.inject_id] }),
  }),
);
