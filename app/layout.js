import './globals.css'

export const metadata = {
  title: 'Warehouse P&L Dashboard',
  description: 'Multi-site 3PL financial model and scenario planner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
