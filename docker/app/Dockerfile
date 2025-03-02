# Step 1: Use the official Node.js image as the base image
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /dockerfile-workdir

# Step 3: Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm version specified in package.json
RUN corepack enable

# Install dependencies
RUN pnpm i --frozen-lockfile

# Step 4: Copy the rest of your application code
COPY . .

# Step 5: Build your application
RUN pnpm build

# Step 6: Define the command to run your app using CMD
# Note: this could be excluded if you want to run the app in other environments, such as development or staging
CMD ["pnpm", "start"]
