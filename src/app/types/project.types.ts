export enum ProjectStatus {
    INITIATION = 'Initiation',
    PLANNING = 'Planning',
    EXECUTION = 'Execution',
    MONITORING = 'Monitoring and Control',
    CLOSURE = 'Closure'
}

export interface Project {
    project_id: string;
    project_name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: ProjectStatus;
    priority: string;
    team_id: string;
    team?: Team;
}

export interface Team {
    team_id: string;
    team_name: string;
    team_lead_id: string;
    department: string;
} 