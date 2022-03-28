"use strict";
const axios = require("axios").default;

//Read parameters from env variable and parse json.
const view_integration_mapping = JSON.parse(process.env.WEBHOOK_CONFIG)

// Handler
module.exports.webhook = async (event) => {
  //Process Glasnostic webhook event data
  const webhook_data = JSON.parse(event.body);

  const hook_env = webhook_data.environment || undefined;
  const hook_event = webhook_data.event || undefined;

  // Check if we have received a valid event
  if (hook_env === undefined || hook_event === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "No event defined for this environment webhook" }),
    };
  }

  // Fetch environment and PagerDuty integration key
  const env = view_integration_mapping[hook_env.id] || false;
  const integration_key = env[hook_event.view.id] || false;

  if (integration_key !== false) {
    // Transform event to PagerDuty format
    const view_url = `https://app.glasnostic.com/environments/${hook_env.id}/views/${hook_event.view.id}/metrics`;
    const view_url_text = hook_event.view.name;

    const formated_metric = `${hook_event.content.metric} ${hook_event.content.value} ${hook_event.content.unit}`;

    var data = {
      payload: {
        summary: `View: ${hook_event.view.name} exceeded threshold ${formated_metric}`,
        timestamp: hook_event.time,
        severity: 'warning', //Adapt this to your needs.
        source: hook_event.view.name,
        // Add custom details to the incident.
        custom_details: {
          'environment': hook_env.name,
          'metric': hook_event.content.metric,
          'value': hook_event.content.value,
        }
      },
      routing_key: integration_key, //integration key from pagerduty
      event_action: 'trigger',
      client: 'Glasnostic Webhook',
      client_url: 'https://app.glasnostic.com',
      // Back link to investigate event in Glasnostic
      links: [{ href: view_url, text: view_url_text }],
    };

    // Send request to PagerDuty API
    try {
      const res = await axios.post("https://events.pagerduty.com/v2/enqueue", data);
      // Log sucessful request
      console.log("Event submitted");

      return {
        statusCode: 200,
        body: "Submitted event to PagerDuty"
      };
    }
    catch (e) {
      // Log error message
      console.log(e.message);

      return {
        statusCode: 400,
        body: JSON.stringify(e.message)
      };
    }
  }
  else {
    console.log("No event found");

    // Default error path
    return {
      statusCode: 404,
      body: JSON.stringify({message: "No event defined for this environment webhook"}),
    };
  }
};