import os

BASE_PATH = r"C:\Users\Jyoshi\Desktop\Timesheets\abhyram-backend\force-app\main\default"

OBJECTS = {
    "Employee__c": {
        "label": "Employee",
        "pluralLabel": "Employees",
        "nameField": {"type": "Text", "label": "Employee Name"},
        "sharingModel": "Private",
        "fields": [
            {"fullName": "User__c", "type": "Lookup", "label": "User", "referenceTo": "User", "relationshipName": "Employees"},
            {"fullName": "Employee_ID__c", "type": "Text", "label": "Employee ID", "length": 20, "externalId": True, "unique": True},
            {"fullName": "Full_Name__c", "type": "Text", "label": "Full Name", "length": 100},
            {"fullName": "Email__c", "type": "Email", "label": "Email", "unique": True},
            {"fullName": "Role__c", "type": "Picklist", "label": "Role", "valueSet": ["Developer", "Designer", "Manager", "Architect"]},
            {"fullName": "Department__c", "type": "Picklist", "label": "Department", "valueSet": ["Engineering", "Design", "Product"]},
            {"fullName": "Cost_Rate__c", "type": "Currency", "label": "Cost Rate", "scale": 2, "precision": 18},
            {"fullName": "Manager__c", "type": "Lookup", "label": "Manager", "referenceTo": "Employee__c", "relationshipName": "Direct_Reports"},
            {"fullName": "Status__c", "type": "Picklist", "label": "Status", "valueSet": ["Active", "Inactive", "On Leave"]},
            {"fullName": "Hire_Date__c", "type": "Date", "label": "Hire Date"}
        ]
    },
    "Project__c": {
        "label": "Project",
        "pluralLabel": "Projects",
        "nameField": {"type": "Text", "label": "Project Name"},
        "sharingModel": "Private",
        "fields": [
            {"fullName": "Project_Code__c", "type": "Text", "label": "Project Code", "length": 20, "externalId": True, "unique": True},
            {"fullName": "Project_Name__c", "type": "Text", "label": "Project Name Detail", "length": 100},
            {"fullName": "Account__c", "type": "Lookup", "label": "Account", "referenceTo": "Account", "relationshipName": "Projects"},
            {"fullName": "Opportunity__c", "type": "Lookup", "label": "Opportunity", "referenceTo": "Opportunity", "relationshipName": "Projects"},
            {"fullName": "Project_Type__c", "type": "Picklist", "label": "Project Type", "valueSet": ["Time & Materials", "Fixed Price"]},
            {"fullName": "Billable__c", "type": "Checkbox", "label": "Billable", "defaultValue": "false"},
            {"fullName": "Billable_Rate__c", "type": "Currency", "label": "Billable Rate", "scale": 2, "precision": 18},
            {"fullName": "Budget_Hours__c", "type": "Number", "label": "Budget Hours", "scale": 2, "precision": 18},
            {"fullName": "Consumed_Hours__c", "type": "Number", "label": "Consumed Hours", "scale": 2, "precision": 18, "defaultValue": "0"},
            {"fullName": "Status__c", "type": "Picklist", "label": "Status", "valueSet": ["Active", "Completed", "On Hold"]},
            {"fullName": "Start_Date__c", "type": "Date", "label": "Start Date"},
            {"fullName": "End_Date__c", "type": "Date", "label": "End Date"},
            {"fullName": "Project_Manager__c", "type": "Lookup", "label": "Project Manager", "referenceTo": "Employee__c", "relationshipName": "Managed_Projects"}
        ],
        "validationRules": [
            {
                "fullName": "End_Date_After_Start_Date",
                "errorConditionFormula": "End_Date__c &lt; Start_Date__c",
                "errorMessage": "End Date must be after Start Date"
            }
        ]
    },
    "Timesheet__c": {
        "label": "Timesheet",
        "pluralLabel": "Timesheets",
        "nameField": {"type": "AutoNumber", "label": "Timesheet #", "displayFormat": "TS-{000000}"},
        "sharingModel": "Private",
        "fields": [
            {"fullName": "Employee__c", "type": "Lookup", "label": "Employee", "referenceTo": "Employee__c", "relationshipName": "Timesheets", "required": True},
            {"fullName": "Week_Start_Date__c", "type": "Date", "label": "Week Start Date"},
            {"fullName": "Week_End_Date__c", "type": "Date", "label": "Week End Date"},
            {"fullName": "Status__c", "type": "Picklist", "label": "Status", "valueSet": ["Draft", "Submitted", "Approved", "Rejected"]},
            {"fullName": "Submitted_Date__c", "type": "DateTime", "label": "Submitted Date"},
            {"fullName": "Approved_By__c", "type": "Lookup", "label": "Approved By", "referenceTo": "User", "relationshipName": "Approved_Timesheets"},
            {"fullName": "Approved_Date__c", "type": "DateTime", "label": "Approved Date"},
            {"fullName": "Rejection_Reason__c", "type": "LongTextArea", "label": "Rejection Reason", "length": 1000, "visibleLines": 3},
            {"fullName": "Comments__c", "type": "LongTextArea", "label": "Comments", "length": 1000, "visibleLines": 3},
            {"fullName": "Total_Hours__c", "type": "Number", "label": "Total Hours", "scale": 2, "precision": 18, "defaultValue": "0"},
            {"fullName": "Billable_Hours__c", "type": "Number", "label": "Billable Hours", "scale": 2, "precision": 18, "defaultValue": "0"}
        ],
        "validationRules": [
            {
                "fullName": "Week_Start_Must_Be_Monday",
                "errorConditionFormula": "MOD(Week_Start_Date__c - DATE(1900, 1, 1), 7) != 0",
                "errorMessage": "Week start date must be a Monday"
            },
            {
                "fullName": "Cannot_Edit_Approved_Timesheet",
                "errorConditionFormula": "AND(ISPICKVAL(PRIORVALUE(Status__c), 'Approved'), NOT(ISNEW()))",
                "errorMessage": "Cannot edit an approved timesheet"
            }
        ]
    },
    "Timesheet_Entry__c": {
        "label": "Timesheet Entry",
        "pluralLabel": "Timesheet Entries",
        "nameField": {"type": "AutoNumber", "label": "Entry #", "displayFormat": "TE-{000000}"},
        "sharingModel": "ControlledByParent",
        "fields": [
            {"fullName": "Timesheet__c", "type": "MasterDetail", "label": "Timesheet", "referenceTo": "Timesheet__c", "relationshipName": "Entries"},
            {"fullName": "Project__c", "type": "Lookup", "label": "Project", "referenceTo": "Project__c", "relationshipName": "Timesheet_Entries"},
            {"fullName": "Date__c", "type": "Date", "label": "Date"},
            {"fullName": "Hours__c", "type": "Number", "label": "Hours", "scale": 2, "precision": 4},
            {"fullName": "Billable__c", "type": "Checkbox", "label": "Billable", "defaultValue": "false"},
            {"fullName": "Notes__c", "type": "LongTextArea", "label": "Notes", "length": 500, "visibleLines": 3},
            {"fullName": "Entry_Type__c", "type": "Picklist", "label": "Entry Type", "valueSet": ["Regular", "Overtime", "PTO", "Sick"]},
            {"fullName": "Created_From_Suggestion__c", "type": "Checkbox", "label": "Created From Suggestion", "defaultValue": "false"}
        ],
        "validationRules": [
            {
                "fullName": "Hours_Must_Be_Valid",
                "errorConditionFormula": "OR(Hours__c &lt; 0.25, Hours__c &gt; 24)",
                "errorMessage": "Hours must be between 0.25 and 24"
            }
        ]
    }
}

def create_field_xml(field):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">']
    xml.append(f'    <fullName>{field["fullName"]}</fullName>')
    xml.append(f'    <label>{field["label"]}</label>')
    xml.append(f'    <type>{field["type"]}</type>')
    
    if field["type"] == "Text":
        xml.append(f'    <length>{field.get("length", 255)}</length>')
    if field.get("externalId"):
        xml.append('    <externalId>true</externalId>')
    if field.get("unique"):
        xml.append('    <unique>true</unique>')
    
    if field["type"] == "Lookup" or field["type"] == "MasterDetail":
        xml.append(f'    <referenceTo>{field["referenceTo"]}</referenceTo>')
        xml.append(f'    <relationshipName>{field["relationshipName"]}</relationshipName>')
        if field.get("type") == "MasterDetail":
             xml.append('    <relationshipOrder>0</relationshipOrder>')
             xml.append('    <writeRequiresMasterRead>false</writeRequiresMasterRead>')
    
    if field["type"] == "Picklist":
        xml.append('    <valueSet>')
        xml.append('        <valueSetDefinition>')
        xml.append('            <sorted>false</sorted>')
        for val in field["valueSet"]:
            xml.append('            <value>')
            xml.append(f'                <fullName>{val}</fullName>')
            xml.append('                <default>false</default>')
            xml.append(f'                <label>{val}</label>')
            xml.append('            </value>')
        xml.append('        </valueSetDefinition>')
        xml.append('    </valueSet>')

    if field["type"] == "Number" or field["type"] == "Currency":
        xml.append(f'    <precision>{field.get("precision", 18)}</precision>')
        xml.append(f'    <scale>{field.get("scale", 0)}</scale>')
    
    if field["type"] == "LongTextArea":
        xml.append(f'    <length>{field.get("length", 32768)}</length>')
        xml.append(f'    <visibleLines>{field.get("visibleLines", 3)}</visibleLines>')

    if field.get("defaultValue"):
         xml.append(f'    <defaultValue>{field["defaultValue"]}</defaultValue>')

    xml.append('</CustomField>')
    return "\n".join(xml)

def create_object_xml(obj_data):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">']
    xml.append('    <deploymentStatus>Deployed</deploymentStatus>')
    xml.append(f'    <label>{obj_data["label"]}</label>')
    xml.append(f'    <pluralLabel>{obj_data["pluralLabel"]}</pluralLabel>')
    xml.append(f'    <sharingModel>{obj_data["sharingModel"]}</sharingModel>')
    
    nameField = obj_data["nameField"]
    xml.append('    <nameField>')
    if nameField["type"] == "AutoNumber":
        xml.append(f'        <displayFormat>{nameField["displayFormat"]}</displayFormat>')
    xml.append(f'        <label>{nameField["label"]}</label>')
    xml.append(f'        <type>{nameField["type"]}</type>')
    xml.append('    </nameField>')
    
    xml.append('</CustomObject>')
    return "\n".join(xml)

def create_validation_xml(rule):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">']
    xml.append(f'    <fullName>{rule["fullName"]}</fullName>')
    xml.append(f'    <active>{str(rule.get("active", True)).lower()}</active>')
    xml.append(f'    <errorConditionFormula>{rule["errorConditionFormula"]}</errorConditionFormula>')
    xml.append(f'    <errorMessage>{rule["errorMessage"]}</errorMessage>')
    xml.append('</ValidationRule>')
    return "\n".join(xml)

def main():
    if not os.path.exists(BASE_PATH):
        print(f"Path not found: {BASE_PATH}")
        return

    objects_path = os.path.join(BASE_PATH, "objects")
    if not os.path.exists(objects_path):
        os.makedirs(objects_path)

    for obj_name, obj_data in OBJECTS.items():
        obj_folder = os.path.join(objects_path, obj_name)
        fields_folder = os.path.join(obj_folder, "fields")
        validation_folder = os.path.join(obj_folder, "validationRules")
        
        if not os.path.exists(fields_folder):
            os.makedirs(fields_folder)
        if not os.path.exists(validation_folder):
            os.makedirs(validation_folder)
            
        # Create Object Meta
        with open(os.path.join(obj_folder, f"{obj_name}.object-meta.xml"), "w") as f:
            f.write(create_object_xml(obj_data))
            
        # Create Fields
        for field in obj_data["fields"]:
            with open(os.path.join(fields_folder, f"{field['fullName']}.field-meta.xml"), "w") as f:
                f.write(create_field_xml(field))

        # Create Validation Rules
        if "validationRules" in obj_data:
            for rule in obj_data["validationRules"]:
                with open(os.path.join(validation_folder, f"{rule['fullName']}.validationRule-meta.xml"), "w") as f:
                     f.write(create_validation_xml(rule))
                
        print(f"Created {obj_name}")

    # Create Permission Set
    perm_set_path = os.path.join(BASE_PATH, "permissionsets")
    if not os.path.exists(perm_set_path):
        os.makedirs(perm_set_path)
    
    with open(os.path.join(perm_set_path, "Workforce_Admin_Access.permissionset-meta.xml"), "w") as f:
        f.write(create_permission_set_xml(OBJECTS))
    print("Created Workforce_Admin_Access Permission Set")

def create_permission_set_xml(objects):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">']
    xml.append('    <label>Workforce Admin Access</label>')
    xml.append('    <hasActivationRequired>false</hasActivationRequired>')
    
    # buffers
    object_perms = []
    field_perms = []

    for obj_name, obj_data in objects.items():
        # Object Permissions
        if obj_name != "Timesheet_Entry__c": # entry is controlled by parent
            object_perms.append('    <objectPermissions>')
            object_perms.append('        <allowCreate>true</allowCreate>')
            object_perms.append('        <allowDelete>true</allowDelete>')
            object_perms.append('        <allowEdit>true</allowEdit>')
            object_perms.append('        <allowRead>true</allowRead>')
            object_perms.append('        <modifyAllRecords>true</modifyAllRecords>')
            object_perms.append(f'        <object>{obj_name}</object>')
            object_perms.append('        <viewAllRecords>true</viewAllRecords>')
            object_perms.append('    </objectPermissions>')
        
        # Field Permissions
        for field in obj_data["fields"]:
            # Skip MasterDetail or required fields as they are implied or not permissionable same way
            if field["type"] != "MasterDetail" and not field.get("required"):
                 field_perms.append('    <fieldPermissions>')
                 field_perms.append('        <editable>true</editable>')
                 field_perms.append(f'        <field>{obj_name}.{field["fullName"]}</field>')
                 field_perms.append('        <readable>true</readable>')
                 field_perms.append('    </fieldPermissions>')

    xml.extend(field_perms)
    xml.extend(object_perms)
    xml.append('</PermissionSet>')
    return "\n".join(xml)

if __name__ == "__main__":
    main()
