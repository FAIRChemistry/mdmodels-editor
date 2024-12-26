import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeCardProps {
  code: string
  language?: string
}

export function CodeCard({ code, language = "markdown" }: CodeCardProps) {
  const lines = code.trim().split("\n")

  return (
    <Card className="mt-4 bg-[#161B22] border-[#30363D]">
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px] w-full">
          <pre className="p-4">
            <code className={`language-${language} text-[#C9D1D9]`}>
              {lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="w-12 inline-block text-[#6E7681] select-none text-right pr-4 border-r border-[#30363D]">
                    {index + 1}
                  </span>
                  <span className="pl-4">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

