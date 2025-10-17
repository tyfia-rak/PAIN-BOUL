import { title } from "@/components/primitives";

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blog`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div>
      <h1 className={title()}>Blog</h1>
      <div className="grid gap-6 mt-6">
        {posts.length === 0 && (
          <p className="text-muted-foreground">Aucun article pour le moment.</p>
        )}
        {posts.map((p: any) => (
          <article key={p.id} className="border border-border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            {p.excerpt && <p className="text-muted-foreground mt-2">{p.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
