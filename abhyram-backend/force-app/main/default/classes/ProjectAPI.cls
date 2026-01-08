@RestResource(urlMapping='/project/v1/*')
global with sharing class ProjectAPI {

    @HttpPost
    global static ProjectResponse createProject() {
        RestRequest req = RestContext.request;
        String requestBody = req.requestBody.toString();

        CreateProjectRequest projectReq = (CreateProjectRequest) JSON.deserialize(
            requestBody,
            CreateProjectRequest.class
        );

        // Validation
        if (String.isBlank(projectReq.projectName)) {
            return new ProjectResponse(false, 'Project Name is required', null);
        }

        if (String.isBlank(projectReq.projectCode)) {
            return new ProjectResponse(false, 'Project Code is required', null);
        }

        // Check for duplicate project code
        List<Project__c> existingProjects = [
            SELECT Id
            FROM Project__c
            WHERE Project_Code__c = :projectReq.projectCode
            LIMIT 1
        ];

        if (!existingProjects.isEmpty()) {
            return new ProjectResponse(false, 'Project Code already exists', null);
        }

        // Create project
        Project__c newProject = new Project__c(
            Project_Name__c = projectReq.projectName,
            Project_Code__c = projectReq.projectCode,
            Status__c = String.isNotBlank(projectReq.status) ? projectReq.status : 'Active',
            Billable__c = projectReq.billable != null ? projectReq.billable : true,
            Project_Type__c = projectReq.projectType,
            Start_Date__c = projectReq.startDate != null ? Date.valueOf(projectReq.startDate) : null,
            End_Date__c = projectReq.endDate != null ? Date.valueOf(projectReq.endDate) : null,
            Budget_Hours__c = projectReq.budgetHours
        );

        try {
            insert newProject;
            
            // Reload to get all fields
            Project__c createdProject = [
                SELECT Id, Project_Name__c, Project_Code__c, Status__c, 
                       Billable__c, Start_Date__c, End_Date__c, Budget_Hours__c,
                       Project_Type__c
                FROM Project__c
                WHERE Id = :newProject.Id
                LIMIT 1
            ];

            return new ProjectResponse(true, 'Project created successfully', createdProject);
        } catch (Exception e) {
            return new ProjectResponse(false, 'Error creating project: ' + e.getMessage(), null);
        }
    }

    @HttpGet
    global static ProjectListResponse getProjects() {
        try {
            List<Project__c> projects = [
                SELECT Id, Project_Name__c, Project_Code__c, Status__c,
                       Billable__c, Start_Date__c, End_Date__c, Budget_Hours__c,
                       Consumed_Hours__c, Project_Type__c
                FROM Project__c
                ORDER BY Project_Name__c
            ];

            return new ProjectListResponse(true, 'Projects retrieved successfully', projects);
        } catch (Exception e) {
            return new ProjectListResponse(false, 'Error retrieving projects: ' + e.getMessage(), null);
        }
    }

    // Request class
    global class CreateProjectRequest {
        public String projectName;
        public String projectCode;
        public String status;
        public Boolean billable;
        public String projectType;
        public String startDate; // YYYY-MM-DD
        public String endDate; // YYYY-MM-DD
        public Decimal budgetHours;
    }

    // Response classes
    global class ProjectResponse {
        public Boolean success;
        public String message;
        public Project__c project;

        public ProjectResponse(Boolean s, String m, Project__c p) {
            this.success = s;
            this.message = m;
            this.project = p;
        }
    }

    global class ProjectListResponse {
        public Boolean success;
        public String message;
        public List<Project__c> projects;

        public ProjectListResponse(Boolean s, String m, List<Project__c> p) {
            this.success = s;
            this.message = m;
            this.projects = p;
        }
    }
}
