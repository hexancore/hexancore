---
layout: doc
title: Getting Started
---

# The Hexan Knight Journey <HcWipTag/>

Embarking on your journey with **Hexancore** is like training to become a _Hexan Knight_. It’s not always easy, and the dark side of bugs and errors lurks around every corner.

![An image](/assets/bugs.webp){ class="storytelling-img" }

But don’t worry, brave developer! This quick start guide is your **Hexakey**, ready to cut through the complexities and get you up and running at light speed. Remember, every master was once a beginner. May your code compile and your tests pass! 🌟

![An image](/assets/hexakey.webp){ class="storytelling-img" style="width:256px;height:256px; border: none;" }

## Chapter 1: Create a Workspace

Before we start, ensure You installed all basic tools:

<HcJsonFetcher url="https://raw.githubusercontent.com/hexancore/nx/main/package.json" :jsonpath-query="{pnpm:'$.packageManager', nx: '$.dependencies[\'@nx/devkit\']'}">
  <template #default="{ data }">
    <li>Visual Code</li>
    <li>Node.js <code>>=22</code></li>
    <li>pnpm <code>npm install -g pnpm@{{ data.pnpm }}</code></li>
    <li>Nx <code>npm install -g nx@{{ data.nx }}</code></li>
    <li>Docker</li>
    <li>make</li>
  </template>
</HcJsonFetcher>

### Introduction to Nx

In the vast expanse of the coding universe, developers seek powerful tools to navigate through the challenges of modern development.

Enter Nx, a set of extensible dev tools designed to help you explore, build, and manage your applications at any scale. Imagine it as a starship, equipped to traverse the complexities of code, allowing you to efficiently manage multiple projects within the same monorepo.

With Nx, you are set to embark on an interstellar journey of discovery and innovation.

### Launching Your Coding Odyssey

Your mission in our training program is create system designed for managing logistics operations in space.

// TODO: Domain overview
// - Module Fleet
// - Module Mission
// - Module Account

As a brave space explorer, you will use Nx to set up your workspace, preparing yourself for the challenges ahead.

### The Command to create workspace 🚀

To launch your starship(workspace), You must first execute a powerful command in terminal.

<HcBashCommand
  command="npx create-nx-workspace astronexus --preset @hexancore/nx --pm pnpm --nxCloud skip --workspaceType integrated"
  :descriptions="{
    'astronexus': 'Name of workspace',
    '--pm pnpm': 'Hexancore best works with pnpm package manager',
    '--preset @hexancore/nx': 'Hexancore Nx preset',
    '--workspaceType integrated': `Hexancore works best in integrated repo <a href=\'https://nx.dev/concepts/integrated-vs-package-based#integrated-repos\'>docs</a>`
  }">
</HcBashCommand>

This command will initialize your workspace with all the necessary configurations for a successful mission.<br>
In our training program we will use `astronexus` as our starship name :).

Now, open created folder in Visual Code, install recommended extensions and run:
<HcBashCommand command="make init_devenv"</HcBashCommand>

And go to next step.

![An image](../assets/guide/started/next-step.webp){ class="storytelling-img" }

## Chapter 2: Backend

Once your workspace is set up, the next step in your mission is to create the backend for application.
The backend is the engine that powers your starship, handling data processing, business logic, and interactions with databases and other services.

### Step 1: Create backend library

Execute the following command(standard execute of Nx generator [docs](https://nx.dev/features/generate-code)) in your terminal to generate a new backend application within your workspace.

<HcBashCommand
  command="nx g @hexancore/nx:lib nebula-explorer/backend --type backend"
  :descriptions="{
    '@hexancore/nx:lib': 'Hexancore library generator',
    'nebula-explorer/backend': 'Library directory, Hexancore supports multi-apps monorepo and convention is <code>[app]/[service]</code>',
    '--type backend': 'Specifies type of library as generic backend',
  }">
</HcBashCommand>

This command will generate a generic backend library in directory `apps/nebula-explorer/backend` and Nx project name will be `nebula-explorer-backend`.

// TODO: fill

### Step 2: Create shared library

// TODO: fill

### Step 3: Create api application

Now we need create http api for our navigation system, execute:

<HcBashCommand
  command="nx g @hexancore/nx:app nebula-explorer/api --type backend"
  :descriptions="{
    '@hexancore/nx:app': 'Hexancore application generator',
    'nebula-explorer/api': 'Application directory, Hexancore supports multi-apps monorepo and convention is <code>[app]/[service]</code>',
    '--type backend': 'Specifies type of application as generic backend',
  }">
</HcBashCommand>

This command will generate a generic backend application in directory `apps/nebula-explorer/api` and Nx project name will be `app-nebula-explorer-api`.
