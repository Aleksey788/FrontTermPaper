import AuthForm from "./AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "signup" ? "signup" : "login";

  return <AuthForm key={initialMode} initialMode={initialMode} />;
}
