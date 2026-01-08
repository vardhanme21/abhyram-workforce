@RestResource(urlMapping='/projects/v1/*')
global with sharing class ProjectAPI {
    
    @HttpPost
    global static ProjectResponse createProject() {
        RestRequest req = RestContext.request;
        String requestBody = req.requestBody.toString();
        
        ProjectRequest projReq = (ProjectRequest) JSON.deserialize(requestBody, ProjectRequest.class);
        
        // Validation
        if (String.isBlank(projReq.projectName)) {
            return new ProjectResponse(false, null, 'Project Name is required');
        }
        if (String.isBlank(projReq.projectCode)) {
            return new ProjectResponse(false, null, 'Project Code is required');
        }
        
        // Check for existing code
        List<Project__c> existing = [SELECT Id FROM Project__c WHERE Project_Code__c = :projReq.projectCode LIMIT 1];
        if (!existing.isEmpty()) {
            return new ProjectResponse(false, null, 'Project Code already exists');
        }
        
        Project__c newProject = new Project__c(
            Name = projReq.projectName, // Set Standard Name
            Project_Name__c = projReq.projectName,
            Project_Code__c = projReq.projectCode,
            Status__c = projReq.status,
            Billable__c = projReq.billable,
            Project_Type__c = projReq.projectType,
            Start_Date__c = projReq.startDate != null ? Date.valueOf(projReq.startDate) : null,
            End_Date__c = projReq.endDate != null ? Date.valueOf(projReq.endDate) : null,
            Budget_Hours__c = projReq.budgetHours
        );
        
        try {
            insert newProject;
            return new ProjectResponse(true, newProject.Id, 'Project created successfully');
        } catch (Exception e) {
            return new ProjectResponse(false, null, 'Error creating project: ' + e.getMessage());
        }
    }
    
    global class ProjectRequest {
        public String projectName;
        public String projectCode;
        public String status;
        public Boolean billable;
        public String projectType;
        public String startDate;
        public String endDate;
        public Decimal budgetHours;
    }
    
    global class ProjectResponse {
        public Boolean success;
        public String projectId;
        public String message;
        
        public ProjectResponse(Boolean success, String projectId, String message) {
            this.success = success;
            this.projectId = projectId;
            this.message = message;
        }
    }
}
