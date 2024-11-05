export class CreateEntityDto {
    name: string;
    description: string;
    victim_sector: string;
    CII: string;
    critical_function: string;
    policy_documents: string; // Could be a file path or URL
  }
  