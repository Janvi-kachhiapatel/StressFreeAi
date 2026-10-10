"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Button, Card, SectionHeading } from "@/components/ui";
import { loadContacts, saveContacts } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";
import type { TrustedContact } from "@/lib/types";

const EMPTY_CONTACTS: TrustedContact[] = [];

/**
 * The support circle is the anti-dependency feature: a reminder that the point
 * of the app is to make reaching a human easier, not to replace them.
 *
 * Names and numbers stay in the browser and are never sent to the model.
 */
export function SupportCircle() {
  const { dict } = useApp();
  const contacts = useStored<TrustedContact[]>("contacts", loadContacts, EMPTY_CONTACTS);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  function add() {
    if (!name.trim()) return;
    const contact: TrustedContact = {
      id: globalThis.crypto?.randomUUID?.() ?? `c-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim() || "someone I trust",
      phone: phone.trim() || undefined,
    };
    saveContacts([...contacts, contact]);
    setName("");
    setRelation("");
    setPhone("");
  }

  function remove(id: string) {
    saveContacts(contacts.filter((contact) => contact.id !== id));
  }

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(dict.circle.template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h3">{dict.circle.title}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.circle.subtitle}</p>
      </div>

      {contacts.length === 0 ? (
        <p className="text-sm text-warn">{dict.circle.empty}</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2"
            >
              <span className="font-medium text-ink">{contact.name}</span>
              <span className="text-xs text-ink-faint">{contact.relation}</span>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="text-sm text-accent underline decoration-accent/40 underline-offset-4"
                >
                  {contact.phone}
                </a>
              )}
              <button
                type="button"
                onClick={() => remove(contact.id)}
                className="ml-auto text-xs text-ink-faint underline decoration-line underline-offset-4 hover:text-danger"
              >
                {dict.circle.remove}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={dict.circle.name}
          aria-label={dict.circle.name}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
        />
        <input
          value={relation}
          onChange={(event) => setRelation(event.target.value)}
          placeholder={dict.circle.relation}
          aria-label={dict.circle.relation}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={dict.circle.phone}
          aria-label={dict.circle.phone}
          inputMode="tel"
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>

      <Button variant="quiet" onClick={add} disabled={!name.trim()}>
        {dict.circle.add}
      </Button>

      <div className="space-y-2 border-t border-line pt-4">
        <p className="text-sm font-medium text-ink">{dict.circle.messageTitle}</p>
        <blockquote className="rounded-xl border border-line bg-surface-2 p-3 text-sm italic text-ink-soft">
          {dict.circle.template}
        </blockquote>
        <Button variant="quiet" onClick={copyTemplate}>
          {copied ? dict.common.copied : dict.circle.copy}
        </Button>
      </div>
    </Card>
  );
}
