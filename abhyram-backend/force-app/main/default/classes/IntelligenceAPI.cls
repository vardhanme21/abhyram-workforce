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
        // Smart suggestion: Find most common project/hours for this weekday in past 4 weeks
        
        // Mock return
        Suggestion s = new Suggestion();
        s.projectId = 'mock-id';
        s.hours = 8;
        s.confidenceScore = 0.95;
        s.reason = 'Regular pattern detected on Mondays';
        
        setResponse(true, 'Suggestion found', s);
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
        public Decimal hours;
        public Decimal confidenceScore;
        public String reason;
    }
}
