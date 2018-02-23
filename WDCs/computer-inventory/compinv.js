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
            id: "Computer_Name",
            alias: "Computer Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Department",
            alias: "Department",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Building",
            alias: "Building",
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
            id: "Make",
            alias: "Make",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "jamf_computers",
            alias: "Small inventory of computers from Jamf.",
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
        $.getJSON("https://user:pass@test.testing.org:8443/JSSResource/advancedcomputersearches/name/computerone", function(resp) {
            var comp = resp.advanced_computer_search.computers;
            var tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = comp.length; i < len; i++) {
                tableData.push({
                    "id": comp[i].id,
                    "name": comp[i].name,
                    "udid": comp[i].udid,
                    "Computer_Name": comp[i].Computer_Name,
                    "Department": comp[i].Department,
                    "Building": comp[i].Building,
                    "Model_Identifier": comp[i].Model_Identifier,
                    "Model": comp[i].Model,
                    "make": comp[i].make
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
            tableau.connectionName = "Jamf Computer List"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
