## Tableau Integrations

Tableau is a sophisticated data visualization tool, capable of analyzing a variety of data types to create business relevant metrics and visualizations.

Integrating Jamf Pro with Tableau's Web Data Connector (WDC) offers an API based connection to securely transfer your Jamf Pro data to Tableau. 

A trial for Tableau can be found on their website.
 + [Tableau trial](https://www.tableau.com/products/trial)


### Connecting to JamfPro via Web Data Connectors

Tableau provides a set of JavaScript libraries and tools for building Web Data Connectors.  Once built, the connections provided by the WDC can be used in Tableau to extract data 
from an API source.

 + [Web Data Connector documentation](http://onlinehelp.tableau.com/current/pro/desktop/en-us/help.html#examples_web_data_connector.html%3FTocPath%3DReference%7CConnector%2520Examples%7C_____61)
 + [Web Data Connector SDK](https://tableau.github.io/webdataconnector/)

One caveat when using Tableau Web Data Connectors, they are JavaScript components effectively running in a basic web browser within Tableau.  This means they are subject to the restriction placed on all browser-based JavaScript components, including cross-domain restriction.  Meaning the WDC must live within the same domain as the Jamf Pro API .

This means the WDC must be running in the same domain as the API it's pulling from.

Customers with on-premises installations can place the WDC within the Jamf Pro Tomcat to avoid cross-domain issues.  Jamf Cloud customers will need to address the cross-domain restriction, one such way would be to run a CORS proxy. 


### Examples

### Tableau Web Data Connector
  + [computer inventory](https://github.com/jamf/TableauIntegrations/tree/master/WDCs/computer-inventory)
  + [mobile device inventory](https://github.com/jamf/TableauIntegrations/tree/master/WDCs/mobile-device-inventory)
  + [combined inventory](https://github.com/jamf/TableauIntegrations/tree/master/WDCs/combined-inventory)


### Tableau Reader
  Tableau visualizations can be exported as standalone workbooks.  The Tableau Reader app is required to view workbooks.

  + [Tableau Reader](https://www.tableau.com/products/reader)


