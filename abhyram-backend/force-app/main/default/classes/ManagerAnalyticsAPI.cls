@RestResource(urlMapping='/manager/analytics/v1/*')
global with sharing class ManagerAnalyticsAPI {

    @HttpGet
    global static AnalyticsResponse getPulse() {
        // Return analytics for the logged in manager
        try {
            RestRequest req = RestContext.request;
            String email = req.params.get('email');
            
            Id userId = UserInfo.getUserId();
            Id managerId;
            
            if (String.isNotBlank(email)) {
                 List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE Email__c = :email LIMIT 1];
                 if (!emps.isEmpty()) managerId = emps[0].Id;
            } else {
                 List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE User__c = :userId LIMIT 1];
                 if (!emps.isEmpty()) managerId = emps[0].Id;
            }

            if (managerId == null) {
                return new AnalyticsResponse(false, 'Manager not found');
            }

            // 1. Team Utilization (Burnout Risk)
            // Get timesheets for direct reports for THIS week
            Date weekStart = Date.today().toStartOfWeek();
            
            List<Employee__c> reports = [SELECT Id, Full_Name__c FROM Employee__c WHERE Manager__c = :managerId];
            Set<Id> reportIds = new Set<Id>();
            for(Employee__c e : reports) reportIds.add(e.Id);

            List<Timesheet__c> currentTimesheets = [
                SELECT Employee__c, Employee__r.Full_Name__c, Total_Hours__c, Billable_Hours__c
                FROM Timesheet__c
                WHERE Employee__c IN :reportIds
                AND Week_Start_Date__c = :weekStart
            ];

            List<RiskMetric> burnoutRisks = new List<RiskMetric>();
            Decimal totalTeamHours = 0;
            Decimal billableHours = 0;

            for (Timesheet__c ts : currentTimesheets) {
                totalTeamHours += ts.Total_Hours__c;
                if (ts.Billable_Hours__c != null) billableHours += ts.Billable_Hours__c;

                if (ts.Total_Hours__c > 45) {
                    RiskMetric r = new RiskMetric();
                    r.name = ts.Employee__r.Full_Name__c;
                    r.value = ts.Total_Hours__c;
                    r.threshold = 40;
                    r.status = 'Critical';
                    burnoutRisks.add(r);
                }
            }

            // 2. Project Budgets (Top 5 Active Projects)
            // Ideally we aggregate all time entries for projects.
            List<Project__c> projects = [
                SELECT Id, Project_Name__c, Budget_Hours__c, 
                       (SELECT Hours__c FROM Timesheet_Entries__r) 
                FROM Project__c 
                WHERE Status__c = 'Active' 
                LIMIT 5
            ];

            List<ProjectMetric> projectHealth = new List<ProjectMetric>();
            for (Project__c p : projects) {
                Decimal used = 0;
                for (Timesheet_Entry__c e : p.Timesheet_Entries__r) {
                    used += e.Hours__c;
                }
                
                ProjectMetric pm = new ProjectMetric();
                pm.projectName = p.Project_Name__c;
                pm.usedHours = used;
                pm.totalBudget = p.Budget_Hours__c != null ? p.Budget_Hours__c : 1000; // Default if null
                pm.percentUsed = (pm.usedHours / pm.totalBudget) * 100;
                projectHealth.add(pm);
            }

            return new AnalyticsResponse(true, burnoutRisks, projectHealth, totalTeamHours, billableHours);

        } catch (Exception e) {
            return new AnalyticsResponse(false, 'Error: ' + e.getMessage());
        }
    }

    global class AnalyticsResponse {
        public Boolean success;
        public String message;
        public List<RiskMetric> burnoutRisks;
        public List<ProjectMetric> projectHealth;
        public Decimal teamTotalHours;
        public Decimal teamBillableHours;

        public AnalyticsResponse(Boolean s, String m) {
            this.success = s;
            this.message = m;
        }

        public AnalyticsResponse(Boolean s, List<RiskMetric> risks, List<ProjectMetric> projs, Decimal total, Decimal billable) {
            this.success = s;
            this.burnoutRisks = risks;
            this.projectHealth = projs;
            this.teamTotalHours = total;
            this.teamBillableHours = billable;
        }
    }

    global class RiskMetric {
        public String name;
        public Decimal value;
        public Decimal threshold;
        public String status;
    }

    global class ProjectMetric {
        public String projectName;
        public Decimal usedHours;
        public Decimal totalBudget;
        public Decimal percentUsed;
    }
}
