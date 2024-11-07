import { date, pgTable, text, serial,  char, varchar, integer, boolean, timestamp, primaryKey, foreignKey } from 'drizzle-orm/pg-core';

// Existing tables
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
});

export const revokedTokensTable = pgTable('revoked_tokens', {
  token_hash: char({ length: 64 }).notNull().unique().primaryKey(),
  revoked_at: timestamp().defaultNow(),
});

export const projectTable = pgTable('project', {
  name: text().notNull(), 
  exercise_type: text({ enum: ['Executive', 'Sectorial'] }).notNull(),
  start_date: date().notNull(),
  end_date: date().notNull(),
  email_header: text().notNull(),
  email_footer: text().notNull(),
  entity_name : text().notNull().references(() => entityTable.name)
});

// New tables based on the diagram

export const entityTable = pgTable('entity', {
  name: varchar().notNull().primaryKey(),  // Making `name` the primary key
  description: text().notNull(),
  victim_sector: text().notNull(),
  CII: varchar().notNull(),
  critical_function: text().notNull(),
  policy_documents: varchar().notNull(),
  participants: varchar().notNull().references(() => participantsTable.email),
  real_threat_landscape: varchar().references(() => masterThreatCubesTable.name)
});

export const CIITable = pgTable('CII', {
  name: varchar().notNull(),
  users: text().notNull(),
  function: text().notNull(),
  sensitive_info: text().notNull(),
  category: text().notNull(),
});

export const participantsTable = pgTable('participants', {
  email: varchar().notNull().primaryKey(),
  role: text().notNull(),
  name: text().notNull(),
});

export const threatActorTable = pgTable('threat_actor', {
  name: varchar().notNull(),
  threat_landscape: text().notNull().references(() => masterThreatCubesTable.name),
  category: text().notNull(),
  intent: text().notNull(),
  rationale: text().notNull(),
  capabilities: text().notNull(),
  project: varchar().notNull().references(() => projectTable.name),
});

export const scenariosTable = pgTable('scenarios', {
  scenario_number: varchar().notNull().primaryKey(),
  threat_actor: varchar().notNull().references(() => threatActorTable.name),
  threat_actor_motivation: text().notNull(),
  entity: varchar().notNull().references(() => entityTable.name),
  CII: varchar().notNull().references(() => CIITable.name),
  intended_system_impact: text().notNull(),
  intended_biz_impact: text().notNull(),
  attack_solution: text().notNull(),
  severity_level: integer().notNull(),
  initial_access: text().notNull(),
  exploit: text().notNull(),
  impact: text().notNull(),
  tactics_techniques: text().notNull(),
  project: varchar().notNull().references(() => projectTable.name),
});

export const injectsTable = pgTable('injects', {
  scenario_number: varchar().notNull().references(() => scenariosTable.scenario_number),
  date_time: timestamp().notNull(),
  inject_sent: boolean().notNull(),
  inject_desc: text().notNull(),
  inject_type: text().notNull(),
  artefact: text().notNull(),
  entity: varchar().notNull().references(() => entityTable.name),
  from: varchar().notNull(),
  to_recipient: varchar().notNull().references(() => roleTable.name),
  project: varchar().notNull().references(() => projectTable.name),
  inject_id: varchar().notNull().primaryKey(),
  observation: text().notNull(),
});

export const responsesTable = pgTable('responses', {
  inject_id: varchar().notNull().references(() => injectsTable.inject_id),
  response: text().notNull(),
});

export const roleTable = pgTable('role', {
  name: varchar().notNull(),
  project: varchar().notNull().references(() => projectTable.name),
});

export const entityThreatCubeTable = pgTable('entity_threat_cube', {
  entity_name: varchar().notNull().references(() => entityTable.name), // Foreign key referencing entity name
  entity_id: integer().primaryKey(), // Unique ID for each row
  threat_cube_id: integer().notNull().references(() => masterThreatCubesTable.id), // Foreign key referencing threat cube ID
  score: integer().notNull(), // Associated score for entity-threat cube relationship
});

export const masterThreatCubesTable = pgTable('master_threat_cubes', {
  category: text().notNull(), // tactic
  name: text().notNull().primaryKey(), // technique
  id: varchar().notNull().primaryKey(), // unique ID for each row
});
