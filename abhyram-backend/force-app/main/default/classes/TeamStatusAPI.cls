@RestResource(urlMapping='/team/v1/status')
global with sharing class TeamStatusAPI {

    @HttpGet
    global static List<TeamMemberStatus> getTeamStatus() {
        // Mock logic for "Live Map" - in reality would query latest login or check-in
        // For now, return all active employees and random status if we don't have real "Online" field
        
        List<Employee__c> employees = [SELECT Id, Name, Role__c, Email__c FROM Employee__c WHERE Status__c = 'Active' LIMIT 50];
        List<TeamMemberStatus> statuses = new List<TeamMemberStatus>();

        for (Employee__c emp : employees) {
            statuses.add(new TeamMemberStatus(emp));
        }

        return statuses;
    }

    global class TeamMemberStatus {
        public String name;
        public String role;
        public String status; // Online, Away, Offline, In a Meeting
        public String location; // Office, Remote

        public TeamMemberStatus(Employee__c e) {
            this.name = e.Name;
            this.role = e.Role__c;
            // Mock random status for demo visual
            Integer rand = Math.mod(Math.abs(Crypto.getRandomInteger()), 3);
            if (rand == 0) this.status = 'Online';
            else if (rand == 1) this.status = 'Away';
            else this.status = 'Focus Mode';

            this.location = 'Remote';
        }
    }
}
