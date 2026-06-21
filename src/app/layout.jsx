import "@/src/index.css";
import { ThemeProvider } from "@/src/context/ThemeContext";

export const metadata = {
  title: "CodeLab",
  description: "Collaborative online real-time code editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
