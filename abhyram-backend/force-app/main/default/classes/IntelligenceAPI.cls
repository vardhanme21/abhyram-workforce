@RestResource(urlMapping='/intelligence/v1/*')
global with sharing class IntelligenceAPI {

    @HttpGet
    global static void getIntelligence() {
        RestRequest req = RestContext.request;
        String type = req.requestURI.substringAfterLast('/');

        if (type == 'suggestions') {
            getSuggestions();
        } else {
            setResponse(false, 'Unknown intelligence type', null);
        }
    }

    private static void getSuggestions() {
        try {
            RestRequest req = RestContext.request;
            String email = req.params.get('email');
            
            Id userId = UserInfo.getUserId();
            List<Employee__c> emps;
            
            if (String.isNotBlank(email)) {
                emps = [SELECT Id FROM Employee__c WHERE Email__c = :email LIMIT 1];
            } else {
                emps = [SELECT Id FROM Employee__c WHERE User__c = :userId LIMIT 1];
            }
            
            if (emps.isEmpty()) {
                setResponse(false, 'Employee not found', null);
                return;
            }
            Id empId = emps[0].Id;

            // Analyze last 30 days
            Date today = Date.today();
            Date thirtyDaysAgo = today.addDays(-30);
            
            // Get history
            List<Timesheet_Entry__c> history = [
                SELECT Project__c, Project__r.Project_Name__c, Hours__c, Date__c
                FROM Timesheet_Entry__c
                WHERE Timesheet__r.Employee__c = :empId
                AND Date__c >= :thirtyDaysAgo
                AND Date__c < :today
            ];

            // 1. Determine current Day of Week (0=Sun, 1=Mon, ...)
            // Reference: Jan 7 1900 is a Sunday
            Date knownSunday = Date.newInstance(1900, 1, 7);
            Integer currentDayOfWeek = Math.mod(knownSunday.daysBetween(today), 7);

            // 2. Filter history for matching day of week
            Map<Id, Decimal> projectHoursMap = new Map<Id, Decimal>();
            Map<Id, String> projectNameMap = new Map<Id, String>();
            Map<Id, Integer> projectCountMap = new Map<Id, Integer>();

            for (Timesheet_Entry__c entry : history) {
                Integer entryDayOfWeek = Math.mod(knownSunday.daysBetween(entry.Date__c), 7);
                
                if (entryDayOfWeek == currentDayOfWeek) {
                    // This entry was on the same day of the week (e.g. previous Mondays)
                    Id pId = entry.Project__c;
                    
                    if (!projectHoursMap.containsKey(pId)) {
                        projectHoursMap.put(pId, 0);
                        projectNameMap.put(pId, entry.Project__r.Project_Name__c);
                        projectCountMap.put(pId, 0);
                    }
                    projectHoursMap.put(pId, projectHoursMap.get(pId) + entry.Hours__c);
                    projectCountMap.put(pId, projectCountMap.get(pId) + 1);
                }
            }

            // 3. Find winner
            Id winnerId = null;
            Decimal maxHours = -1;
            
            for (Id pId : projectHoursMap.keySet()) {
                if (projectHoursMap.get(pId) > maxHours) {
                    maxHours = projectHoursMap.get(pId);
                    winnerId = pId;
                }
            }

            if (winnerId != null) {
                Suggestion s = new Suggestion();
                s.projectId = winnerId;
                s.projectName = projectNameMap.get(winnerId);
                // Average hours? Or Mode? Let's use Average of the logs, rounded.
                Decimal avg = projectHoursMap.get(winnerId) / projectCountMap.get(winnerId);
                s.hours = avg.setScale(1); 
                s.confidenceScore = 0.85; // Mock confidence for now
                s.reason = 'Based on your activity on previous ' + getDayName(currentDayOfWeek) + 's';
                
                setResponse(true, 'Suggestion found', s);
            } else {
                // No specific pattern found, maybe return a generic one or null
                setResponse(false, 'No sufficient history pattern found', null);
            }

        } catch (Exception e) {
            setResponse(false, 'Error: ' + e.getMessage(), null);
        }
    }

    private static String getDayName(Integer dayIndex) {
        List<String> days = new List<String>{'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'};
        return days[Math.abs(dayIndex)];
    }

    private static void setResponse(Boolean success, String message, Object data) {
        RestContext.response.headers.put('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(JSON.serialize(new IntelligenceResponse(success, message, data)));
    }

    global class IntelligenceResponse {
        public Boolean success;
        public String message;
        public Object data;

        public IntelligenceResponse(Boolean s, String m, Object d) {
            this.success = s;
            this.message = m;
            this.data = d;
        }
    }
    
    global class Suggestion {
        public String projectId;
        public String projectName;
        public Decimal hours;
        public Decimal confidenceScore;
        public String reason;
    }
}
