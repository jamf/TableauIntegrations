(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "name",
            alias: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "udid",
            alias: "UDID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Display_Name",
            alias: "Display Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Building",
            alias: "Building",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Model_Number",
            alias: "Model Number",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Model_Identifier",
            alias: "Model Identifier",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Model",
            alias: "Model",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "iOS_Version",
            alias: "iOS Version",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Asset_Tag",
            alias: "Asset Tag",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Department",
            alias: "Department",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "jamf_mobile",
            alias: "Small inventory of mobile devices from Jamf.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    // Populate just inventory data
    myConnector.getData = function(table, doneCallback) {
        // add header directive to get json
        // force GET so inline auth works correctly
        $.ajaxSetup({ 
          headers: { "Accept": "application/json" },
          type: 'GET'
        });
        // do basic authentication inline with url.  this is to bypass the browser basic auth popup
        $.getJSON("https://user:pass@test.testing.org:8443/JSSResource/advancedmobiledevicesearches/name/mobileone", function(resp) {
            var mob = resp.advanced_mobile_device_search.mobile_devices;
            var tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = mob.length; i < len; i++) {
                tableData.push({
                    "id": mob[i].id,
                    "name": mob[i].name,
                    "udid": mob[i].udid,
                    "Display_Name": mob[i].Display_Name,
                    "Building": mob[i].Building,
                    "Model_Number": mob[i].Model_Number,
                    "Model_Identifier": mob[i].Model_Identifier,
                    "Model": mob[i].Model,
                    "iOS_Version": mob[i].iOS_Version,
                    "Asset_Tag": mob[i].Asset_Tag,
                    "Department": mob[i].Department
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Jamf Mobile Device List"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
