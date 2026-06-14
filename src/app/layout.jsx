import "@/src/index.css";

export const metadata = {
  title: "CodeLab",
  description: "Collaborative online real-time code editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
