<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into tsukie-v4-astro. A reusable `posthog.astro` snippet component was created and injected into `BaseLayout.astro` so every page is automatically instrumented. Six client-side events were added across five components to track the blog's core conversion and engagement actions: newsletter subscriptions (from both the subscribe page form and the sidebar widget), subscribe page views (top of the newsletter funnel), article sharing by platform, project card clicks by project name, and sponsor/featured project widget clicks.

| Event | Description | File |
|---|---|---|
| `newsletter_subscribed` | User submits the newsletter form from the subscribe page | `src/components/SubscribeForm.astro` |
| `newsletter_subscribed` | User submits the newsletter form from the sidebar widget | `src/components/WidgetNewsletter.astro` |
| `subscribe_page_viewed` | User views the dedicated subscribe page (top of conversion funnel) | `src/pages/subscribe.astro` |
| `article_shared` | User clicks Twitter or Facebook share button on an article | `src/components/ShareBtnRow.astro` |
| `project_clicked` | User clicks a project card | `src/components/ProjectCard.astro` |
| `sponsor_link_clicked` | User clicks the sponsor/featured project widget | `src/components/WidgetSponsor.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/400550/dashboard/1528440
- **Newsletter Subscriptions Over Time**: https://us.posthog.com/project/400550/insights/pycEkauy
- **Newsletter Conversion Funnel** (subscribe page view → subscription): https://us.posthog.com/project/400550/insights/G2sUSWhz
- **Article Shares by Platform** (Twitter vs Facebook): https://us.posthog.com/project/400550/insights/0xwiSJQi
- **Project Clicks by Project**: https://us.posthog.com/project/400550/insights/DdnJHr6i
- **Sponsor Link Clicks Over Time**: https://us.posthog.com/project/400550/insights/qGBQuTQW

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
