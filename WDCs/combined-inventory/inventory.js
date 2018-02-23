(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define data connection schema
  myConnector.getSchema = function(schemaCallback) {
    // Define schema for general inventory data columns 
    var gencols = [
      { id:"id", dataType:tableau.dataTypeEnum.int },
      { id:"type", alias:"type", dataType:tableau.dataTypeEnum.string },
      { id:"name", alias:"name", dataType:tableau.dataTypeEnum.string },
      { id:"model", alias:"model", dataType:tableau.dataTypeEnum.string },
      { id:"os_version", alias:"os version", dataType:tableau.dataTypeEnum.string },
      { id:"last_update", alias:"last update", dataType:tableau.dataTypeEnum.string },
      { id:"building", alias:"building", dataType:tableau.dataTypeEnum.string },
      { id:"department", alias:"department", dataType:tableau.dataTypeEnum.string },
      { id:"username", alias:"username", dataType:tableau.dataTypeEnum.string },
      { id:"asset_tag", alias:"asset tag", dataType:tableau.dataTypeEnum.string }
    ]
     
    // Define table for general inventory data columns
    var genTable = {
      id: "genTable",
      alias: "General inventory device data.",
      columns: gencols
    };
    
    schemaCallback([genTable]);
  };


  // Get the data via the Jamf API, getData method is called once for each api call
  myConnector.getData = function(table, doneCallback) {

    // add header directive to get json
    // btoa() only works with 8bit chars
    // get user:pass values from form fields passed via tableau library
    var creds = tableau.username + ":" + tableau.password;
    var auth = "Basic " + btoa(creds);
    var api_call = {};
    api_call.one = jamf.server_name + jamf.api_call.one;
    api_call.two = jamf.server_name + jamf.api_call.two;
     
    $.ajaxSetup({
      headers: {  
        "Accept": "application/json",
        "Authorization": auth },
      type: "GET" 
    });

    // calls to basic computer and mobile device info
    $.when(
      $.getJSON(api_call.one, function(resp) {

        // populate data from computers query 
        var dat = resp.advanced_computer_search.computers;
        var tableData = [];

        for (var i = 0, len = dat.length; i < len; i++) {
          tableData.push({
            "id": dat[i].id,
            "type": "computer",
            "name": dat[i].Computer_Name,
            "model": dat[i].Model_Identifier,
            "os_version": dat[i].Operating_System_Version,
            "last_update": dat[i].Last_Inventory_Update,
            "building": dat[i].Building,
            "department": dat[i].Department,
            "username": dat[i].Username,
            "asset_tag": dat[i].udid,
          });
        }

        table.appendRows(tableData);
      }),

      $.getJSON(api_call.two, function(resp) {
        var dat = resp.advanced_mobile_device_search.mobile_devices;
        var tableData = [];

        // populate data from mobile query 
        for (var i = 0, len = dat.length; i < len; i++) {
          tableData.push({
            "id": dat[i].id,
            "type": "mobile device",
            "name": dat[i].name,
            "model": dat[i].Model_Identifier,
            "os_version": dat[i].iOS_Version,
            "last_update": dat[i].Last_Inventory_Update,
            "building": dat[i].Building,
            "department": dat[i].Department,
            "username": dat[i].Username,
            "asset_tag": dat[i].udid,
          });
        }

        table.appendRows(tableData);
      })
    ).then(function() { 
      doneCallback();
    })
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function() {
    $("#submitButton").click(function() {
      tableau.username = $("#user").val();
      tableau.password = $("#pass").val();
      tableau.connectionName = "Jamf General Inventory";
      tableau.submit();
    });
  });

})();


