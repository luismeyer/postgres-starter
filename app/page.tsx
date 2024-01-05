import { Suspense } from "react";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function Titles() {
  const titles = await sql<{ title: string }>`SELECT * FROM titles`;

  return (
    <div>
      {titles.rows.map((title, i) => (
        <div key={`${title} ${i}`}>{title.title}</div>
      ))}
    </div>
  );
}

export default function Home() {
  async function createDumbTitle() {
    "use server";

    await sql<{ title: string }>`
        INSERT INTO titles (title) VALUES ('dumb_title');
    `;

    revalidatePath("/");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Postgres on Vercel
      </h1>

      <form action={createDumbTitle}>
        <button type="submit">Validate</button>
      </form>

      <Suspense>
        <Titles />
      </Suspense>
    </main>
  );
}
