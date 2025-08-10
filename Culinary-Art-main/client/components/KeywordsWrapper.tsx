import KeywordsFilter from "./KeywordsFilter";

export default async function KeywordsWrapper() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/recipes/keywords`,
    {
      next: {
        revalidate: 86400,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text(); // fallback when not JSON
    throw new Error(`API Error: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (!data.success) return null;

  return <KeywordsFilter keywords={data.data} />;
}
