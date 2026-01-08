import './globals.css'

export const metadata = {
      title: 'Notes App - Manage Your Notes',
      description: 'A simple and elegant notes application built with Next.js and MongoDB',
}

export default function RootLayout({ children }) {
      return (
            <html lang="en">
                  <body className="antialiased">
                        {children}
                  </body>
            </html>
      )
}

