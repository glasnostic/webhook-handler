# Glasnostic Webhook Transformer Service

This sample code demonstrates how to integrate Glasnostic and PagerDuty. This code acompanies our blog post on integrating Glasnostic and PagerDuty. It makes use of the webhook feature in Glasnostic to send notifications to different third-party services.

To run this sample, you will need to create a PagerDuty account and create a service. We assume that you already have access to a Glasnostic environment. If you'd like to get started with Glasnostic first please visit our [Quickstart](https://docs.glasnostic.com/quickstart/) to get started quickly.

Visit our [homepage](https://www.glasnostic.com) for more information about Glasnostic and runtime control.

## Deployment

Set up the integration to PagerDuty in the env.yml file. Rename env.yml.example to env.yml and fill in the values. For each service you monitorin in PagerDuty you will need to set up the Events V2 integration and copy the integration key.

```bash
npm install 
npx serverless deploy
```

After deploying, you should see output similar to:

```bash
✔ Service deployed to stack GlasnosticWebhookHandler-production

endpoint: POST - https://<id>.execute-api.us-west-2.amazonaws.com/
```

Copy the URL to the endpoint and configure the Webhook in the Glasnostic Console. See the [Webhook](https://docs.glasnostic.com/product/webhooks/) documentation for more information how to configure webhooks.

> Depending on your webhook configuration in Glasnostic this may trigger a lot of invocations. Be sure to configure the webhook with reasonable values to avoid unnecessary costs due to a high amount of lambda invocations.

## License

This code is licensed under the Apache 2.0 license. See the LICENSE file for more details.