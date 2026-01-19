export type ParsedCommand = {
    intent: 'LOG_TIME' | 'NAVIGATE' | 'UNKNOWN';
    entities: {
        hours?: number;
        project?: string;
        date?: string; // 'today' | 'yesterday'
        page?: string;
    };
    original: string;
};

export function parseVoiceCommand(transcript: string): ParsedCommand {
    const text = transcript.toLowerCase();

    // 1. Navigation Intent
    if (text.includes('go to') || text.includes('navigate to')) {
        let page = 'dashboard';
        if (text.includes('manager')) page = 'manager';
        if (text.includes('projects')) page = 'projects';
        if (text.includes('reports')) page = 'reports';
        if (text.includes('leave')) page = 'leave';
        
        return {
            intent: 'NAVIGATE',
            entities: { page },
            original: transcript
        };
    }

    // 2. Log Time Intent
    // "Log 4 hours on Alpha Project"
    // "Add 2 hours to Beta"
    if (text.includes('log') || text.includes('add') || text.includes('track')) {
        // Extract Hours
        // Regex for "X hours" or "Xh"
        const hoursMatch = text.match(/(\d+(\.\d+)?)\s*(hours|hour|h)/);
        let hours = 0;
        if (hoursMatch) {
            hours = parseFloat(hoursMatch[1]);
        }

        // Extract Project (simple heuristic: words after 'on' or 'for')
        // "on Project Alpha"
        let project = undefined;
        const projectMatch = text.match(/(?:on|for)\s+(.+)/);
        if (projectMatch) {
            // Cleanup: remove common trailing words if user keeps speaking?
            // For now take the rest of string but maybe truncate simple common fillers
            project = projectMatch[1].trim(); 
        }

        return {
            intent: 'LOG_TIME',
            entities: { hours, project },
            original: transcript
        };
    }

    return {
        intent: 'UNKNOWN',
        entities: {},
        original: transcript
    };
}
