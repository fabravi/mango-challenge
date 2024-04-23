import "@/styles/globals.scss";

export default function ExercisesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="main">{children}</main>;
}
