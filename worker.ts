interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BREVO_API_KEY: string;
  BREVO_LIST_ID: string;
  BREVO_DOI_TEMPLATE_ID: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function redirect(request: Request, result: 'pending' | 'error') {
  return Response.redirect(new URL(`/subscribe?subscription=${result}`, request.url), 303);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/api/subscribe') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return new Response('Invalid form submission', { status: 400 });
    }

    // Silently accept bot submissions so the honeypot does not reveal itself.
    if (form.get('website')) {
      return redirect(request, 'pending');
    }

    const email = form.get('email');
    if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
      return new Response('Valid email required', { status: 400 });
    }

    const listId = Number(env.BREVO_LIST_ID);
    const templateId = Number(env.BREVO_DOI_TEMPLATE_ID);
    if (
      !env.BREVO_API_KEY ||
      !Number.isInteger(listId) ||
      listId <= 0 ||
      !Number.isInteger(templateId) ||
      templateId <= 0
    ) {
      console.error('Brevo environment variables are not configured');
      return redirect(request, 'error');
    }

    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        includeListIds: [listId],
        templateId,
        redirectionUrl: new URL('/subscribe?subscription=confirmed', request.url).toString(),
      }),
    });

    if (!response.ok) {
      console.error('Brevo subscription failed', response.status);
      return redirect(request, 'error');
    }

    return redirect(request, 'pending');
  },
};
