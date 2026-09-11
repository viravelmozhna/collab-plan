"use client";

import Link from "next/link";

import { useAuth } from "@/context/auth-provider";
import TryDemoButton from "@/components/try-demo-button";

const FEATURES = [
  "Create lists and share them with other users by username",
  "Add, edit, complete and delete tasks",
  "Changes appear instantly for everyone viewing the same list",
  "See who created and who last updated every task",
];

const STACK = [
  "Next.js 14 (App Router) + TypeScript + Tailwind",
  "Node.js, Express and Socket.IO",
  "MongoDB with Mongoose, JWT authentication",
];

const HomePage = () => {
  const { isAuthenticated, username } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold text-bluish">Plan Together</h1>
      <p className="text-lg mt-12">
        A real-time collaborative to-do list. Share a list with someone and you
        both see every change as it happens, without refreshing.
      </p>

      <div className="mt-40 max-w-[400px]">
        {isAuthenticated ? (
          <>
            <p className="mb-12">{`Signed in as ${username}.`}</p>
            <Link href="/lists">
              <button type="button">Go to your projects</button>
            </Link>
          </>
        ) : (
          <>
            <TryDemoButton />
            <p className="text-greyish-2 text-sm mt-12">
              No sign-up needed. You get your own sample list to play with, and
              it is deleted after a week.
            </p>
            <p className="text-sm mt-12">
              Already have an account? <Link href="/login" className="text-bluish underline">Log in</Link>
              {" or "}
              <Link href="/signup" className="text-bluish underline">sign up</Link>.
            </p>
          </>
        )}
      </div>

      <section className="mt-40">
        <h2 className="text-2xl font-bold">What it does</h2>
        <ul className="mt-12 flex flex-col gap-8">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="mt-40">
        <h2 className="text-2xl font-bold">Built with</h2>
        <ul className="mt-12 flex flex-col gap-8">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-20">
          <a
            className="text-bluish underline"
            href="https://github.com/viravelmozhna/collab-plan"
            target="_blank"
            rel="noreferrer"
          >
            View the source on GitHub
          </a>
        </p>
      </section>

      <p className="text-greyish-2 text-sm mt-40 mb-40">
        Hosted on free tiers, so the first request after a quiet spell can take
        up to a minute while the server wakes up.
      </p>
    </div>
  );
};

export default HomePage;
