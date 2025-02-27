import {
  date,
  pgTable,
  text,
  serial,
  char,
  varchar,
  integer,
  timestamp,
  primaryKey,
  pgEnum,
  foreignKey,
  json,
  time,
  unique,
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
  name: varchar().notNull(),
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
    .references(() => entitiesTable.id, { onDelete: 'cascade' }),
});

export const participantsTable = pgTable('participants', {
  email: varchar().primaryKey().unique(),
  name: text().notNull(),
});

export const threatLandscapeTable = pgTable(
  'threat_landscape',
  {
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id, { onDelete: 'cascade' }),
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
    }).onDelete('cascade'),
  }),
);

export const scenariosTable = pgTable(
  'scenarios',
  {
    scenario_number: varchar().notNull(),
    additional_context: text().notNull(),
    scenario_title: text().notNull(),
    threat_actor_motivation: text().notNull(),
    intended_system_impact: text().notNull(),
    intended_biz_impact: text().notNull(),
    attack_sophistication: text().notNull(),
    severity_level: integer().notNull(),
    initial_access: text().notNull(),
    exploit: text().notNull(),
    impact: text().notNull(),
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id, { onDelete: 'cascade' }),
    asset_id: integer()
      .notNull()
      .references(() => assetsTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.scenario_number, table.project_id] }),
  }),
);

// this must always be kept in sync with scenarios
export const scenariosGeneratedTable = pgTable(
  'scenarios_generated',
  {
    scenario_number: varchar().notNull(),
    additional_context: text(),
    scenario_title: text(),
    threat_actor_motivation: text(),
    intended_system_impact: text(),
    intended_biz_impact: text(),
    attack_sophistication: text(),
    severity_level: integer(),
    initial_access: text(),
    exploit: text(),
    impact: text(),
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id, { onDelete: 'cascade' }),
    asset_id: integer()
      .notNull()
      .references(() => assetsTable.id, { onDelete: 'cascade' }),
    generation_inputs: json().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.scenario_number, table.project_id] }),
  }),
);

// TODO: generated tables for msel and threats

export const injectsTable = pgTable(
  'injects',
  {
    id: serial().unique().primaryKey(),
    inject_id: varchar().notNull(),
    // schema draws 1-1, I believe it's many injects to 1 scenario
    scenario_number: varchar(),
    project_id: integer().notNull(),
    date: date(),
    time: time(),
    inject_desc: text().notNull(),
    inject_type: text(),
    artefact: text(),
    from: varchar().notNull(),
    to_recipient: varchar().notNull(),
    iteration: integer().notNull(),
    upload_key: varchar().references(() => mselTable.msel, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.project_id],
      foreignColumns: [projectsTable.id],
    }).onDelete('cascade'),
    uniqueComposite: unique().on(
      table.project_id,
      table.iteration,
      table.inject_id,
      table.upload_key,
    ),
  }),
);

// export const responsesTable = pgTable('responses', {
//   inject_id: varchar()
//     .notNull()
//     .references(() => injectsTable.inject_id, { onDelete: 'cascade' }),
//   response: text().notNull(),
//   id: serial('id').unique().primaryKey(),
// });

export const masterThreatCubesTable = pgTable('master_threat_cubes', {
  threat_cube_id: text().primaryKey(), // Use only `id` as primary key
  // tactic: text()
  //   .notNull()
  //   .references(() => tacticsTable.id),
  name: text().notNull(),
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
      .references(() => entitiesTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.entity_id] }),
  }),
);

// ------- JOIN TABLES -------

export const injectsToScenariosTable = pgTable('injects_to_scenarios', {
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
  inject_id: integer()
    .notNull()
    .references(() => injectsTable.id),
  scenario_number: varchar()
    .notNull()
    .references(() => scenariosTable.scenario_number),
});

export const cubesToTacticsTable = pgTable(
  'cubes_to_tactics',
  {
    tactic_id: text()
      .notNull()
      .references(() => tacticsTable.id),
    technique_id: text()
      .notNull()
      .references(() => masterThreatCubesTable.threat_cube_id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tactic_id, table.technique_id] }),
  }),
);

export const entitesToParticipantsTable = pgTable(
  'entities_to_participants',
  {
    participant_email: varchar()
      .notNull()
      .references(() => participantsTable.email, { onDelete: 'cascade' }),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.participant_email, table.entity_id] }),
  }),
);

export const entitiesToThreatCubesTable = pgTable(
  'entities_to_threat_cubes',
  {
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id, { onDelete: 'cascade' }),
    threat_cube_id: text()
      .notNull()
      .references(() => masterThreatCubesTable.threat_cube_id, {
        onDelete: 'cascade',
      }),
    score: integer().notNull(), // Associated score for entity-threat cube relationship
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.entity_id, table.threat_cube_id],
    }),
  }),
);

export const participantsToRolesTable = pgTable(
  'participants_to_roles',
  {
    id: serial('id').unique().primaryKey(),
    participant_email: varchar()
      .notNull()
      .references(() => participantsTable.email, { onDelete: 'cascade' }),
    role_name: varchar().notNull(),
    role_entity_id: integer().notNull(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.role_name, table.role_entity_id],
      foreignColumns: [rolesTable.name, rolesTable.entity_id],
    }).onDelete('cascade'),
  }),
);

export const projectsToEntitiesTable = pgTable(
  'projects_to_entities',
  {
    project_id: integer()
      .notNull()
      .references(() => projectsTable.id, { onDelete: 'cascade' }),
    entity_id: integer()
      .notNull()
      .references(() => entitiesTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entity_id, table.project_id] }),
  }),
);

export const emailsTable = pgTable('emails', {
  id: serial('id').unique().primaryKey(),
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'cascade' }),
  to: text().array().notNull(),
  cc: text().array(),
  bcc: text().array(),
  subject: text().notNull(),
  html: text().notNull(),
  attachments: text().array(),
  redis_job_id: varchar(),
  schedule_date_time: timestamp(),
  error_message: text(),
  status: text().default('notScheduled'), // status: notScheduled, scheduled, sent, failed
  observations: text(),
});

export const serverTypeEnum = pgEnum('server_type', ['simx1', 'simx2']);

export const serverTable = pgTable('server', {
  server: serverTypeEnum().default('simx1'),
});

export const mselTable = pgTable('msel', {
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id),
  msel: text().notNull().primaryKey(),
  date_uploaded: timestamp().notNull(),
});

export const jobTypesEnum = pgEnum('job_types', ['scenario', 'msel', 'threat']);
export const jobStatusEnum = pgEnum('job_status', [
  'pending',
  'failed',
  'done',
]);
export const jobsTable = pgTable('jobs', {
  id: serial('id').primaryKey(),
  type: jobTypesEnum().notNull(),
  status: jobStatusEnum().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  name: text().notNull(),
  project_id: integer()
    .notNull()
    .references(() => projectsTable.id, { onDelete: 'cascade' }),
});
