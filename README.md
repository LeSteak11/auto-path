# AutoPath

A guided curriculum generator that takes user intake, generates dynamic follow-up questions, and creates personalized learning plans.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation  
- **API**: Next.js API routes with mock LLM provider

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/lib` - Zod schemas, types, and utilities  
- `/src/components` - Reusable UI components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
