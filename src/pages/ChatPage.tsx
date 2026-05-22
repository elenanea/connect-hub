import { Search, Send } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import { chatThreads } from "@/data/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const activeThread = chatThreads[0];

const ChatPage = () => {
  return (
    <PlatformShell
      title="Чат підприємств"
      subtitle="Простір для швидких переговорів, узгодження умов співпраці та обміну деталями щодо товарів, послуг і міських проєктів."
    >
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="surface-panel p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Пошук діалогів" />
            </div>
            <div className="mt-5 space-y-3">
              {chatThreads.map((thread, index) => (
                <button
                  key={thread.id}
                  type="button"
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground hover:bg-accent"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{thread.title}</h2>
                    {thread.unread > 0 && <span className="rounded-full border border-primary-foreground/20 px-2 py-1 text-xs font-medium">{thread.unread}</span>}
                  </div>
                  <p className={`mt-2 text-sm ${index === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{thread.excerpt}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="surface-panel flex min-h-[680px] flex-col overflow-hidden">
            <div className="border-b border-line px-6 py-5">
              <h2 className="text-xl font-semibold">{activeThread.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{activeThread.partner}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {activeThread.messages.map((message, index) => (
                <div key={`${message.time}-${index}`} className={`flex ${message.role === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl border px-4 py-3 ${message.role === "me" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    <p className="text-sm font-medium">{message.from}</p>
                    <p className="mt-2 text-sm leading-6">{message.text}</p>
                    <p className={`mt-2 text-xs ${message.role === "me" ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="flex gap-3">
                <Input placeholder="Написати повідомлення партнеру" />
                <Button>
                  <Send className="h-4 w-4" />
                  Надіслати
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </PlatformShell>
  );
};

export default ChatPage;
