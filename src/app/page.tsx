export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040d21] via-[#0c162d] to-[#040d21]">
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-4 sm:px-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Schema Exporter
          </h1>
          <p className="text-lg text-[#768390] mb-8">
            Export your schema in multiple formats
          </p>
          <SchemaExporter />
        </main>
      </div>
    </div>
  )
}

