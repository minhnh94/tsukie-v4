---
title: The ultimate broke noob guide to self-hosting
tags: indie
date: 2026-01-11
ready: true
thumbnail: https://i.imgur.com/1LhTbs9.png
slug: the-ultimate-broke-noob-guide-to-self-hosting
summary: My playbook for self hosting 20+ services managing 100GB+ of personal data at zero cost. Straightforward, practical, no fluff.
readCount: 200
---

I used to dodge servers like the plague. Too much ops bullshit. I just wanted to write code, so I lived on serverless and free platforms and called it a day.

Then I started seeing tech bros I admire self-hosting. [Writing about it](https://dev.to/code42cate/every-developer-needs-to-self-host-43mm). [Recommending it](https://x.com/levelsio/status/1845186558414159875?s=46). [Escaping the cloud](https://world.hey.com/dhh/we-have-left-the-cloud-251760fb). That got my attention. I wanted to run real stacks like PHP, Ruby, Elixir, not be boxed into JavaScript just because I was freeloading on Vercel and Cloudflare Pages.

I'm cheap, so even a dirt-cheap VPS felt like an unnecessary expense. Turns out that excuse was trash. Oracle Cloud gives you a legitimately powerful server for free, roughly what you'd pay hundreds a month for on AWS. That killed my last reason to procrastinate.

I signed up, grabbed the free VPS, and immediately hit the classic problem: where the hell do you even start?

Then I found a stupidly simple self-hosting setup on Twitter. Clicks, not pain. It felt like Vercel, but on my own box. No magic, no suffering. That's when it clicked. The original post vanished into thin air, but my knowledge remains, so I'm gonna jot down on its behalf.

In this guide, I'll show you how to grab a free Oracle Cloud VPS, set up Dokploy or Coolify, and deploy your own apps without losing your sanity.

### Get your free lunch from Oracle Cloud

[Go here and sign up for an OCI account](https://signup.oraclecloud.com/). It will ask for a credit card (not debit/prepaid/virtual card so be prepared).

Upgrade to Pay as you go (PAYG) to reserve servers at any capacity on OCI. Your payment method must have at least $100 ready for verification. You won't be charged if your usage stays within the free tier. A PAYG upgrade ensures server reservations and prevents idle servers from being taken down.

Check out [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/) for free offerings within your quota. You can have 4 CPU, 24GB memory, and 200GB SSD across up to 4 VPS. Consolidate these specs into one VPS or create 4 with 6GB memory and 50GB SSD each, all for free. This is generous even compared to traditional VPS providers, let alone cloud.

Let's create a VPS instance of any spec you prefer to move on to the next section. Go to [https://cloud.oracle.com/compute/instances/create](https://cloud.oracle.com/compute/instances/create) to create one. If you're unsure about the settings, here are mine:

![Seriously you can just leave all default options as is, the only thing you need to make right is the "shape". Make sure it's Ampere Standard.A1.Flex. You should see the "Always-free eligible" tag visible next to the selection.](https://i.imgur.com/ax2lCJo.jpeg)

Seriously you can just leave all default options as is, the only thing you need to make right is the "shape". Make sure it's Ampere Standard.A1.Flex. You should see the "Always-free eligible" tag visible next to the selection.

Look up common cloud-init scripts to set up your fresh instance after spinning up. They'll apply basic hardening and security setup, so you can focus on other things. I use this one: [https://gist.github.com/w3cj/cdd447b1a10ce741e4ee968fa6b75553](https://gist.github.com/w3cj/cdd447b1a10ce741e4ee968fa6b75553).

A basic practice to secure your VM is to configure your VPS firewall to block all incoming connections except ports 80/443 and keep port 22 open to your home network. You can do this via Security List configuration in OCI's Networking or using a Linux built-in package like `ufw`.

Make sure you can SSH into your VPS instance, and then we can move on to the next step!

### Install your deployment PaaS of choice

Two popular choices are [https://dokploy.com](https://dokploy.com/) and [https://coolify.io](https://coolify.io/). You can't go wrong with either. Install them by ssh'ing into your VPS and running a single command. Access the Dokploy/Coolify web page at the specified address (If you configured your firewall to block all ports except 80/443, temporarily disable it to access the web page and do initial setup until you can access it via domain name and reverse proxy).

I'm using Dokploy, so my content will be based on that. If you choose Coolify though the content should still be easy to follow. Let's host [Gatus, a simple uptime monitoring web app](https://gatus.io/).

### Self-host a Dockerized app

Log in, click on Projects \> Create Project, fill in the information, and click on Create.

![](https://i.imgur.com/mujaMws.jpeg)

Go into the newly created project, click Create Service \> Compose, and create a Docker compose yaml file to define your self-hosted app's requirements.

![](https://i.imgur.com/MSN1bWJ.jpeg)

Go to the newly created service. You'll see several tabs with options, which may seem overwhelming. Let's simplify this. In the General tab, select the Provider section and paste the yaml definition below into the editor:

![](https://i.imgur.com/nfD57DA.jpeg)

```yaml
services:
  gatus:
    image: twinproduction/gatus:latest
    volumes:
      - ../files/config:/config	# files mounted in Advanced tab are located under "files" folder
    restart: always

```

Also, mount the config file to the docker volume. Switch to the Advanced tab, click on Add Volume, and paste the code below into the editor:

![](https://i.imgur.com/BcyKtie.jpeg)

![](https://i.imgur.com/2gjVnwZ.jpeg)

```yaml
# Content to fill in
endpoints:
  - name: website                 # Name of your endpoint, can be anything
    url: "<https://twin.sh/health>"
    interval: 5m                  # Duration to wait between every status check (default: 60s)
    conditions:
      - "[STATUS] == 200"         # Status must be 200
      - "[BODY].status == UP"     # The json path "$.status" must be equal to UP
      - "[RESPONSE_TIME] < 300"   # Response time must be under 300ms

  - name: make-sure-header-is-rendered
    url: "<https://example.org/>"
    interval: 60s
    conditions:
      - "[STATUS] == 200"                          # Status must be 200
      - "[BODY] == pat(*<h1>Example Domain</h1>*)" # Body must contain the specified header

```

To keep things secure, we'll need you to access your app using HTTP/HTTPS, not any other custom ports. To do this, we'll set up a domain in your Dokploy reverse proxy. We'll use [traefik.me](https://www.notion.so/tsukie/traefik.me) for this. Go to the Domains tab and click Add Domain. In the dialog that pops up, choose "`gatus"` in the Service Name section. Then, click the dice symbol next to the Host input field and enter the port number from your Docker Compose file in the Container Port section. Keep everything else as it is. Once you're done, click Create.

![](https://i.imgur.com/WnmFrYd.jpeg)

Finally, return to the General tab, click Deploy, and wait for it to finish. Then, switch to the Domains tab and access the URL defined there and you should be able to see the Gatus uptime status page. If you own a domain, I'll guide you on how to set up your custom domain later.

![If you follow the steps above, you should be able to access your self-hosted Gatus instance at the address generated with traefik.me like this.](https://i.imgur.com/abHFItj.jpeg)

If you follow the steps above, you should be able to access your self-hosted Gatus instance at the address generated with traefik.me like this.

### Custom domain for your app

If you have a custom domain and want to use it, here's how you can access your app through it. Basically, you'll need to set up DNS records to direct your domain to the IP address of your OCI VPS. Then, you can use that domain in the Domains section we discussed earlier, enable HTTPS, and you're all set! Let's get started.

Just so you know, I'm using Cloudflare as my domain registrar, but you should be able to follow along easily even if you're using something else like GoDaddy or Namecheap. In the Cloudflare dashboard sidebar, click on DNS \> Records. Then, click on Add record, enter your domain name (or subdomain name if you want to access your app through a subdomain) in the Name field, enter your VPS IP in the IPv4 address field, and click Save.

![A reference on how to fill in your DNS record in your registrar website. I will make my Gatus instance accessible at gatus.tsukie.com.](https://i.imgur.com/OYZgxvf.jpeg)

A reference on how to fill in your DNS record in your registrar website. I will make my Gatus instance accessible at [gatus.tsukie.com](http://gatus.tsukie.com/)

Go back to Deploy Domains tab, replace the value in Host field with the domain/subdomain you just set earlier, enable HTTPS option (just pick Let's Encrypt in the dropdown), and redeploy once again using the Deploy button in General tab.

![](https://i.imgur.com/5SXs1pP.jpeg)

You should now be able to access your app via your domain/subdomain through the https protocol.

![](https://i.imgur.com/YOdIAKt.jpeg)

### Dockerize your app for self-hosting.

You can either create an Application by clicking Create Service \> Application and hook your source code to the Dokploy Application as instructed in the Provider section. However, this isn't recommended for production deployment as it consumes significant resources in your VPS and can potentially bring down your VPS and its contents. (Note: This is less likely with a 24GB RAM OCI VPS, but it's worth considering, especially if you have multiple projects deployed in parallel).

![](https://i.imgur.com/iV8qYxe.jpeg)

![If you don't care about optimization, just hook your app's repository on this screen and it will automagically deploy the app for you. Read on to see the better approach.](https://i.imgur.com/yqet2kY.jpeg)

If you don't care about optimization, just hook your app's repository on this screen and it will automagically deploy the app for you. Read on to see the better approach.

Or build your Docker image, push it to a Docker registry, and have Dokploy pull it when running a Docker Compose template. This is recommended for deploying to production, especially on low-end VPS with limited resources. We'll use GitHub Docker Registry in this tutorial.

First, create an access token on GitHub to push your build.

![Go to this page to create the token for pushing to Github docker registry. I don't remember the least necessary scopes for pushing so I just check all 🤣](https://i.imgur.com/qmZYTgw.jpeg)

Go to this page to create the token for pushing to Github docker registry. I don't remember the least necessary scopes for pushing so I just check all 🤣

We will dockerize a simple Hello world app by creating a Dockerfile to package our app, building it and pushing artifacts to GitHub Docker Registry, and having Dokploy pulling the artifacts from there and deploying to the internet.

First, [clone this project](https://github.com/minhnh94/deploy-homebrew-app-example) to your local machine. It's a simple Go script that starts a server that echoes "Hello world" when accessed via a browser. The project includes a Dockerfile that packages our application into an image, allowing us to push it to a registry and pull it from the registry to use.

After finishing cloning, go into the root folder of the project and execute these commands below to build and push your image to your Github registry. I will assume your package will be named `deploy-homebrew-app-example` to execute these commands:

```bash
# Authenticate
docker login ghcr.io -u YOUR_USERNAME -p YOUR_GITHUB_TOKEN

# Build
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/deploy-homebrew-app-example:latest .

# Push
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/deploy-homebrew-app-example:latest
```

Now that your image has been pushed to your Github registry with the tag `latest`, we will be using it in another Dokploy Composer application. First you will need to add the registry with your credentials to Dokploy so it can pull from Github registry (assuming that you don't make the image public access).

![](https://i.imgur.com/O0IAOHV.jpeg)

![](https://i.imgur.com/fZJU22y.jpeg)

Next is to create a Compose Service to pull the image and deploy it. The steps will be similar to the "Self hosting a Dockerized application" section above so I will show the screenshot of the Composer editor only here:

![Replace the "image" value with your own image tag of course.](https://i.imgur.com/x2dda8Y.jpeg)

Replace the "image" value with your own image tag of course.

The final step to make your app accessible is to create a record in Dokploy's Domains tab and point it to our service. You can use [traefik.me](http://traefik.me/) if you don't own a domain or use your custom domain/subdomain for this.

![I'll just use traefik.me to quickly finish this. The dice roll button generates accessible domain instantly for you.](https://i.imgur.com/r0yKMAX.jpeg)

I'll just use traefik.me to quickly finish this. The dice roll button generates accessible domain instantly for you.

Your app should now be accessible on the internet! 🎉

![](https://i.imgur.com/MdQ6l91.jpeg)

### Hosting OpenClaw on Dokploy

Want your own always-on AI sidekick without paying SaaS tax? Host OpenClaw on the same Dokploy box.
It's just Docker + env vars. No wizardry.

![](https://i.imgur.com/OtmzIyD.jpeg)

Create a new **Compose** service in Dokploy and paste:

```yaml
services:
  # Only for first time setup, you can comment out after setup is done
  # Without this part, openclaw would fail to create its own workspace because mounted volumes require root privilege
  openclaw-perms:
     image: alpine/openclaw:latest
     user: "0:0"
     volumes:
       - openclaw_data:/home/node/.openclaw
       - exec_folder:/usr/local/bin
     command: ["sh", "-lc", "mkdir -p /home/node/.openclaw && chown -R 1000:1000 /home/node/.openclaw"]
     restart: "no"

  openclaw-gateway:
    image: alpine/openclaw:latest
    environment:
      HOME: /home/node
      TERM: xterm-256color
      OPENCLAW_GATEWAY_TOKEN: ${OPENCLAW_GATEWAY_TOKEN}
      CLAUDE_AI_SESSION_KEY: ${CLAUDE_AI_SESSION_KEY}
      CLAUDE_WEB_SESSION_KEY: ${CLAUDE_WEB_SESSION_KEY}
      CLAUDE_WEB_COOKIE: ${CLAUDE_WEB_COOKIE}
    volumes:
      - openclaw_data:/home/node/.openclaw
      - exec_folder:/usr/local/bin
    ports:
      - "18789"
      - "18790"
    init: true
    restart: unless-stopped
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "auto",
        "--port",
        "18789",
        "--allow-unconfigured",
      ]

volumes:
  openclaw_data: {}
  exec_folder: {}
```

The `openclaw-perms` service is there to fix volume permissions (mounted Docker volumes default to root, and OpenClaw runs as uid 1000). Deploy once with it, then comment it back out and redeploy. Skip this and you'll stare at permission errors wondering what you did wrong.

Set your env vars in Dokploy's environment section — don't hardcode secrets in the compose file. The `OPENCLAW_GATEWAY_TOKEN` is your admin key to the gateway control UI. The Claude keys are for your AI provider sessions.

Port `18789` on http is the control UI. Add a domain in the Domains tab pointing to `18789`, enable HTTPS, and you're live. Lock it down with Tinyauth or Cloudflare Access unless you enjoy strangers configuring your AI.

The `openclaw_data` volume is your brain. Everything OpenClaw remembers lives there. Back it up or accept the consequences.

Okay now container's up and running. Almost there — one last thing. SSH into your VPS, exec into the container, and run the onboarding wizard. This is where OpenClaw sets up its workspace and walks you through connecting your channels, models, and all that good stuff.

```bash
# SSH into your VPS, then hop into the container
docker exec -it <your-openclaw-container> bash

# Inside the container, run the onboard script
cd /app
node dist/index.js onboard
```

Follow the prompts, fill in your details, and that's it. You're done. OpenClaw is live on your own hardware, running on your own terms. Go talk to it.

If you already survived setting up Dokploy, this part is easy. OpenClaw is just another container — except this one talks back.

### Backups

Afraid you'll nuke your system and have nothing to roll back to? Relax. Dokploy/Coolify makes backups and restores stupidly simple. If things go sideways, you rewind and move on instead of crying over lost data.

Placeholder stays for later additions.

### Additional fluff you might find useful

**Do yourself a favor and install Tailscale on your VPS instance.**
Seriously, this is one of those tools that feels optional until you try it once. Tailscale gives you a private, encrypted network between your laptop, phone, and VPS without opening extra ports or messing with scary firewall rules. SSH becomes dead simple, you can access internal dashboards without exposing them to the public internet, and it just works across networks. For a broke noob setup, it's basically free magic.

**Expose services running inside your VPS using Cloudflare Tunnel.**
If you're allergic to opening ports or want to keep things extra locked down, Cloudflare Tunnel is your friend. It lets you expose a local service (like an admin panel or internal app) through Cloudflare without your VPS having any public-facing port at all. Combine this with Cloudflare Access and you get auth, HTTPS, and protection for free. This is especially nice for stuff you don't want indexed by Google or randomly poked by bots. If you haven't known yet, most self-hosted services can be hosted this way using Cloudflare Tunnel, though it does come with some limitations (you can't stream media for example).

**Dozzle, Beszel, Tinyauth.**
These are small quality-of-life tools that make self-hosting feel less like sysadmin hell. Dozzle gives you a clean web UI for Docker logs so you're not constantly tailing logs in the terminal. Beszel helps you keep an eye on server resources without going full Prometheus-brain. Tinyauth is great for quickly slapping basic auth in front of internal tools. None of these are mandatory, but once you add a few, you'll wonder how you lived without them.

**r/selfhosted**
This subreddit is both a goldmine and a productivity trap. You'll discover cool projects, weird setups, and people running 200 services on a Raspberry Pi for no good reason. It's great for inspiration, troubleshooting ideas, and discovering tools you didn't even know existed. Just be warned: it's very easy to go from "I'll just host one app" to "why am I running my own mail server".

**openalternative.co**
Think of this as a map from SaaS products to things you can self-host. Every time you see a paid tool and think "there has to be a free version of this", openalternative is usually right. Not everything there is production-ready, but it's an excellent way to explore options and slowly replace paid services with stuff running on your own VPS.

That's it. You don't need all of this on day one. Start small, break things, learn just enough Linux to be dangerous, and enjoy the feeling of owning your stack again. Just like I have done. Never thought I would enjoy tending my own digital garden this much 😉
